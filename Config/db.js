const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();

const DateBase = process.env.MONGO_URI;

const db = () => {
  mongoose
    .connect(DateBase)
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = db;
