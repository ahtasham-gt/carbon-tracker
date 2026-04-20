const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  vehicle: String,
  fuel: String,
  distance: Number,
  model: String,
  year: Number,
  emission: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Trip", tripSchema);