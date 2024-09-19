const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const dotenv = require("dotenv");

dotenv.config();

const login = async (req, res) => {
  try {
    const [email, password, phone] = req.body;
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    let errorMessage = [
      {
        check: !password,
        message: "Lütfen tüm alanları doldurunuz",
      },
      {
        check: !email && !phone,
        message: "Lütfen tüm alanları doldurunuz",
      },
      {
        check: user.email !== email && user.phone !== phone,
        message: "Kullanıcı bulunamadı",
      },
      {
        check: !(await bcrypt.compare(password, user.password)),
        message: "Şifre ve email hatalı",
      },
    ];

    let i = 0;
    while (i < errorMessage.length) {
      if (errorMessage[i].check) {
        return res.status(400).json({ message: errorMessage[i].message });
      }
      i++;
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "86400",
    });
    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json({ message: "Giriş yapıldı", token });
  } catch (error) {
    console.log("🚀 ~ login ~ error:", error);
  }
};

const register = async (req, res) => {
  try {
    const { name, email, phone, age, gender, password, passwordConfirm } =
      req.body;

    const user = await User.findOne({ $or: [{ email }, { phone }] });
    let errorMessage = [
      {
        check:
          !name ||
          !email ||
          !phone ||
          !age ||
          !gender ||
          !password ||
          !passwordConfirm,
        message: "Lütfen tüm alanları doldurunuz",
      },
      {
        check: user.email === email && user.phone === phone,
        message: "Kullanılmış email ve telefon numarası",
      },
      {
        check: password !== passwordConfirm,
        message: "Sifreler uyuşmuyor",
      },
    ];

    let i = 0;
    while (i < errorMessage.length) {
      if (errorMessage[i].check) {
        return res.status(400).json({ message: errorMessage[i].message });
      }
      i++;
    }
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCase: false,
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    req.body.otp = otp;
    const newUser = new User({
      name,
      email,
      phone,
      age,
      gender,
    });
    const result = await newUser.save();
    if (!result) {
      throw new Error("Kayıt sırasında hata oluştu.");
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "E-posta doğrulaması için OTP'niz",
      text: `Hesap doğrulaması için: ${otp}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(200).json({ message: "Kayıt yapıldı", token });
  } catch (error) {
    console.log("🚀 ~ register ~ error:", error);
  }
};

const accountDelet = async (req, res) => {
  try {
    const { token, email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Lütfen tüm alanları doldurunuz" });
    }
    const user = await User.findOne({ email });

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
    const { name, email, phone, age, gender, picture, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }
    const passwordController = await bcrypt.compare(password, user.password);
    if (!passwordController) {
      return res.status(400).json({ message: "Aynı şifre ile güncellenemez" });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.age = age || user.age;
    user.gender = gender || user.gender;
    user.password = password || user.password;
    user.picture = picture || user.picture;
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
