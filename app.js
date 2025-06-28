const express = require('express');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicles');
const bookingRoutes = require('./routes/bookings');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;
