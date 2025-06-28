const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const { calculateRideDurationHours } = require('../utils/rideDuration');

exports.createBooking = async (req, res, next) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;
    if (!vehicleId || !fromPincode || !toPincode || !startTime || !customerId)
      return res.status(400).json({ error: 'Missing fields' });

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

    const start = new Date(startTime);
    const duration = calculateRideDurationHours(fromPincode, toPincode);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    const conflict = await Booking.exists({
      vehicleId,
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    if (conflict) return res.status(409).json({ error: 'Vehicle already booked for that time' });

    const booking = await Booking.create({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
      customerId
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};
