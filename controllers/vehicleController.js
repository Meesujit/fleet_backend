const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const { calculateRideDurationHours } = require('../utils/rideDuration');

exports.addVehicle = async (req, res, next) => {
  try {
    const { name, capacityKg, tyres } = req.body;
    if (!name || !capacityKg || !tyres) return res.status(400).json({ error: 'All fields required' });

    const vehicle = await Vehicle.create({ name, capacityKg, tyres });
    res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
};

exports.getAvailableVehicles = async (req, res, next) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
    if (!capacityRequired || !fromPincode || !toPincode || !startTime)
      return res.status(400).json({ error: 'Missing required query parameters' });

    const start = new Date(startTime);
    const duration = calculateRideDurationHours(fromPincode, toPincode);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    const candidates = await Vehicle.find({ capacityKg: { $gte: capacityRequired } });

    const available = [];
    for (const vehicle of candidates) {
      const hasOverlap = await Booking.exists({
        vehicleId: vehicle._id,
        $or: [
          { startTime: { $lt: end }, endTime: { $gt: start } }
        ]
      });

      if (!hasOverlap) {
        available.push({
          ...vehicle.toObject(),
          estimatedRideDurationHours: duration
        });
      }
    }

    res.status(200).json({ vehicles: available, estimatedRideDurationHours: duration });
  } catch (err) {
    next(err);
  }
};
