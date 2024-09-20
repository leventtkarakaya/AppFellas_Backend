const moongose = require("mongoose");

const destionationSchema = new moongose.Schema({
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  iata: {
    type: String,
  },
  icao: {
    type: String,
  },
  publicName: {
    dutch: {
      type: String,
    },
    english: {
      type: String,
    },
  },
});

const Destination = moongose.model("Destination", destionationSchema);

module.exports = Destination;
