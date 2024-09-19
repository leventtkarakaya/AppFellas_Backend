const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Lütfen geçerli bir email adresi giriniz."],
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 99,
  },
  gender: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  otp: {
    type: Number,
  },
  isVerified: {
    type: Boolean,
    default: false,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 32,
    validate: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Şifreniz en az 8 karakterli, en az bir küçük harf, bir büyük harf, bir rakam ve bir özel karakter içermelidir.",
    ],
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
