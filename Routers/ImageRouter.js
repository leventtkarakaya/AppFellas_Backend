const express = require("express");
const expressFormidable = require("express-formidable");
const { uploadImage } = require("../Controller/ImageUpload");

router = express.Router();

router.post(
  "/upload-image",
  expressFormidable({ maxFieldsSize: 5 * 2024 * 2024 }),
  uploadImage
);
module.exports = router;
