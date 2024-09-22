const moongose = require("mongoose");

const destionationSchema = new moongose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
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
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

const Destination = moongose.model("Destination", destionationSchema);

module.exports = Destination;
