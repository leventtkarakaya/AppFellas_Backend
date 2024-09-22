const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    lastUpdatedAt: {
      type: Date,
      required: true,
    },
    aircraftType: {
      iataMain: {
        type: String,
        required: true,
      },
      iataSub: {
        type: String,
        required: true,
      },
    },
    flightDirection: {
      type: String,
      enum: ["A", "D"],
      required: true,
    },
    flightName: {
      type: String,
      required: true,
    },
    flightNumber: {
      type: Number,
      required: true,
    },
    isOperationalFlight: {
      type: Boolean,
      required: true,
    },
    mainFlight: {
      type: String,
      required: true,
    },
    prefixIATA: {
      type: String,
      required: true,
    },
    prefixICAO: {
      type: String,
      required: true,
    },
    airlineCode: {
      type: Number,
      required: true,
    },
    publicFlightState: {
      flightStates: {
        type: [String],
        required: true,
      },
    },
    route: {
      destinations: {
        type: [String],
        required: true,
      },
      eu: {
        type: String,
        required: true,
      },
      visa: {
        type: Boolean,
        required: true,
      },
    },
    scheduleDate: {
      type: String,
      required: true,
    },
    scheduleTime: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
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

// Modeli oluştur
const Flight = mongoose.model("Flight", flightSchema);

module.exports = Flight;
