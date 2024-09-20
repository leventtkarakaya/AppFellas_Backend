const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./Config/db");

dotenv.config();

const app = express();

db();

app.use(cors());

app.use(express.json({ extended: true, limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Hello World! I am working fine");
});

const flight = require("./Routers/FlightRouter");

app.use("/api/v1/flight", flight);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Bir hata oluştu!" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
