const express = require("express");

const {
  login,
  register,
  accountDelet,
  accountUpdate,
} = require("../Controller/AuthConroller");

router = express.Router();

// Belirli endpoint'ler için route tanımlamaları
router.post("/login", login);
router.post("/register", register);
router.post("/accountDelete", accountDelet);
router.put("/accountUpdate", accountUpdate);

module.exports = router;
