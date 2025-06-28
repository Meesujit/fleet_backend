module.exports.calculateRideDurationHours = (from, to) => {
  return Math.abs(parseInt(to) - parseInt(from)) % 24;
};
