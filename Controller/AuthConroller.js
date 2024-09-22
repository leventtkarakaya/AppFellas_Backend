const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const dotenv = require("dotenv");

dotenv.config();

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        message: "Geçersiz e-posta veya şifre",
        success: false,
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "86400",
    });
    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json({ message: "Giriş yapıldı", token, user });
  } catch (error) {
    console.log("🚀 ~ login ~ error:", error);
    res.status(500).json({ message: error });
  }
};

const register = async (req, res) => {
  try {
    const { name, surname, email, phone, password, passwordConfirm } = req.body;
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(400).json({ message: "Kullanıcı mevcut" });
    }
    if (
      !name ||
      !surname ||
      !email ||
      !phone ||
      !password ||
      !passwordConfirm
    ) {
      return res
        .status(400)
        .json({ message: "Lütfen tüm alanları doldurunuz" });
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCase: false,
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    req.body.otp = otp;

    if (password === passwordConfirm) {
      // ? Create new user
      const newUser = new User({
        name,
        surname,
        email,
        phone,
        password,
        otp,
      });
      const result = await newUser.save();
      if (!result) {
        throw new Error("Kayıt sırasında hata oluştu.");
      }
      // ? Token generate
      const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET);
      // ? Send mail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      // ? Mail options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "E-posta doğrulaması için OTP'niz",
        text: `Hesap doğrulaması için: ${otp}`,
      };
      // ? Send mail function error
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.status(201).json({ message: "Kayıt yapıldı", data: result, token });
    }
  } catch (error) {
    console.log("🚀 ~ register ~ error:", error);
    res.status(500).json({ message: error });
  }
};

const accountDelet = async (req, res) => {
  try {
    const { token, email, password, userId } = req.body;
    if (token == null) {
      return res.status(400).json({ message: "Giriş yapmanız gerekiyor" });
    }
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Lütfen tüm alanları doldurunuz" });
    }
    const user = await User.findById(userId);

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Sifre ve email hatalı" });
    }
    await User.findByIdAndDelete(user.id);
    res.status(200).json({ message: "Hesap silindi" });
  } catch (error) {
    console.log("🚀 ~ accountDe ~ error:", error);
  }
};

const accountUpdate = async (req, res) => {
  try {
    const { name, email, userId, phone, token, password, passwordConfirm } =
      req.body;
    console.log(name, email, phone, password, passwordConfirm);
    console.log("UserID", userId);

    if (token == null) {
      return res.status(400).json({ message: "Giriş yapmanız gerekiyor" });
    }
    const user = await User.findById(userId);
    console.log("🚀 ~ accountUpdate ~ user:", user);
    if (!user) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Şifreler aynı olmalıdır" });
    }
    const passwordController = await bcrypt.compare(password, user.password);
    if (passwordController) {
      return res.status(400).json({ message: "Aynı şifre ile güncellenemez" });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.password = password || user.password;
    await user.save();
    res.status(200).json({ message: "Hesap bilgileri güncellendi" });
  } catch (error) {
    console.log("🚀 ~ accountUpdate ~ error:", error);
  }
};

module.exports = {
  login,
  register,
  accountDelet,
  accountUpdate,
};
