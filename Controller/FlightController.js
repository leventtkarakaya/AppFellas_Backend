const Flight = require("../Models/Flight");
const Airline = require("../Models/Airlines");
const Destination = require("../Models/Destionations");
const axios = require("axios");
const moment = require("moment");

const getFlight = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.schiphol.nl/public-flights/flights",
      {
        headers: {
          resourceversion: "v4",
          app_id: "4ac7e434",
          app_key: "fd735175919381e83b3aaf57f679ecfd",
          accept: "application/json",
        },
      }
    );
    const flightsData = response.data.flights || [];
    const flightsToSave = flightsData.map((item) => {
      return {
        lastUpdatedAt: moment(item.lastUpdatedAt).toDate(),
        aircraftType: {
          iataMain: item.aircraftType.iataMain,
          iataSub: item.aircraftType.iataSub,
        },
        flightDirection: item.flightDirection,
        flightName: item.flightName,
        flightNumber: item.flightNumber,
        id: item.id,
        isOperationalFlight: item.isOperationalFlight,
        mainFlight: item.mainFlight,
        prefixIATA: item.prefixIATA,
        prefixICAO: item.prefixICAO,
        airlineCode: item.airlineCode,
        publicFlightState: {
          flightStates: item.publicFlightState.flightStates,
        },
        route: {
          destinations: item.route.destinations,
          eu: item.route.eu,
          visa: item.route.visa,
        },
        scheduleDateTime: moment(item.scheduleDateTime).toDate(),
        scheduleDate: item.scheduleDate,
        scheduleTime: item.scheduleTime,
        serviceType: item.serviceType,
        schemaVersion: item.schemaVersion,
      };
    });

    if (flightsToSave.length > 0) {
      await Flight.insertMany(flightsToSave);
    }
    res.status(200).json({
      message: "Uçuş bilgileri başarıyla kaydedildi.",
      data: flightsData,
    });
  } catch (error) {
    console.log("🚀 ~ getFlight ~ error:", error);
    res.status(500).json({ message: "Uçuş bilgileri getirilemedi" });
  }
};
const getAirlines = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.schiphol.nl/public-flights/airlines",
      {
        headers: {
          resourceversion: "v4",
          app_id: "4ac7e434",
          app_key: "fd735175919381e83b3aaf57f679ecfd",
          accept: "application/json",
        },
      }
    );
    console.log(response.data.airlines);
    const airlinesData = response.data.airlines || [];
    const airlinesToSave = airlinesData.map((item) => {
      return {
        iata: item.iata,
        icao: item.icao,
        nvls: item.nvls,
        publicName: item.publicName,
      };
    });
    if (airlinesToSave.length > 0) {
      await Airline.insertMany(airlinesToSave);
    }
    res.status(200).json({
      message: "Ucus bilgileri başarıyla kaydedildi.",
      data: airlinesData,
    });
  } catch (error) {
    console.log("🚀 ~ getAirlines ~ error:", error);
    res.status(500).json({ message: "Uçus Bilgileri getirilmedi" });
  }
};

const getDestination = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.schiphol.nl/public-flights/destinations",
      {
        headers: {
          resourceversion: "v4",
          app_id: "4ac7e434",
          app_key: "fd735175919381e83b3aaf57f679ecfd",
          accept: "application/json",
        },
      }
    );
    console.log(response.data.destinations);
    const destinationsData = response.data.destinations;
    const destinationsToSave = destinationsData.map((item) => {
      return {
        city: item.city,
        country: item.country,
        iata: item.iata,
        publicName: {
          dutch: item.publicName.dutch,
          english: item.publicName.english,
        },
      };
    });
    if (destinationsToSave.length > 0) {
      await Destination.insertMany(destinationsToSave);
    }
    res.status(200).json({
      message: "Ucus bilgileri başarıyla kaydedildi.",
      data: destinationsData,
    });
  } catch (error) {
    console.log("🚀 ~ getDestination ~ error:", error);
    res.status(500).json({ message: "Uçus Bilgileri getirilmedi" });
  }
};

module.exports = {
  getFlight,
  getAirlines,
  getDestination,
};
