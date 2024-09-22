const mongoose = require("mongoose");

const airlineSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  iata: {
    type: String,
  },
  icao: {
    type: String,
  },
  nvls: {
    type: Number,
    default: 0,
  },
  publicName: {
    type: String,
  },
});

const Airline = mongoose.model("Airline", airlineSchema);

module.exports = Airline;
