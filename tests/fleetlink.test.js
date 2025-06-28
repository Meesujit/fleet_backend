const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), {});
});

afterEach(async () => {
  await Vehicle.deleteMany();
  await Booking.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('FleetLink API Tests', () => {

  it('should add a new vehicle', async () => {
    const res = await request(app).post('/api/vehicles').send({
      name: 'Eicher 1012',
      capacityKg: 1200,
      tyres: 6
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Eicher 1012');
  });

  it('should return available vehicles with no conflict', async () => {
    const vehicle = await Vehicle.create({ name: 'Ashok', capacityKg: 1000, tyres: 6 });

    const res = await request(app).get('/api/vehicles/available').query({
      capacityRequired: 500,
      fromPincode: '110001',
      toPincode: '110010',
      startTime: new Date().toISOString()
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles.length).toBe(1);
    expect(res.body.vehicles[0]._id).toBe(vehicle.id);
  });

  it('should not return a vehicle if there is a booking conflict', async () => {
    const vehicle = await Vehicle.create({ name: 'Conflict Truck', capacityKg: 1000, tyres: 6 });

    const start = new Date();
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000); // 3h

    await Booking.create({
      vehicleId: vehicle._id,
      fromPincode: '123456',
      toPincode: '123459',
      startTime: start,
      endTime: end,
      customerId: 'test-user'
    });

    const res = await request(app).get('/api/vehicles/available').query({
      capacityRequired: 500,
      fromPincode: '123456',
      toPincode: '123459',
      startTime: start.toISOString()
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles.length).toBe(0);
  });

  it('should create a booking if available', async () => {
    const vehicle = await Vehicle.create({ name: 'Available Truck', capacityKg: 1000, tyres: 6 });

    const res = await request(app).post('/api/bookings').send({
      vehicleId: vehicle._id,
      fromPincode: '123456',
      toPincode: '123458',
      startTime: new Date().toISOString(),
      customerId: 'abc123'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.vehicleId).toBe(vehicle._id.toString());
  });

  it('should not allow double booking of a vehicle', async () => {
    const vehicle = await Vehicle.create({ name: 'Double Book Truck', capacityKg: 1000, tyres: 6 });

    const start = new Date();
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    await Booking.create({
      vehicleId: vehicle._id,
      fromPincode: '111111',
      toPincode: '111113',
      startTime: start,
      endTime: end,
      customerId: 'first'
    });

    const res = await request(app).post('/api/bookings').send({
      vehicleId: vehicle._id,
      fromPincode: '111111',
      toPincode: '111113',
      startTime: start.toISOString(),
      customerId: 'second'
    });

    expect(res.statusCode).toBe(409);
  });

});
