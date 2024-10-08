const express = require("express");

const {
  getFlight,
  getAirlines,
  getDestination,
} = require("../Controller/FlightController");

router = express.Router();

// Belirli endpoint'ler için route tanımlamaları
router.post("/getFlight", getFlight);
router.get("/getAirlines", getAirlines);
router.get("/getDestination", getDestination);

module.exports = router;
