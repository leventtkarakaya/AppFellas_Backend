const mongoose = require("mongoose");

const airlineSchema = new mongoose.Schema({
  iata: {
    type: String,
    required: true,
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
    required: true,
  },
});

const Airline = mongoose.model("Airline", airlineSchema);

module.exports = Airline;
