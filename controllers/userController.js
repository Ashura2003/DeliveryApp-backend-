const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

// User Login
const userLogin = async (req, res) => {};

// User Register
const userRegister = async (req, res) => {
  const { username, email, phone, password } = req.body;

  try {
    if (!username || !email || !phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    const existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Validator for email and strong password
    if (!validator.isEmail) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      username: username,
      email: email,
      phone: phone,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// User Profile
const userProfile = async (req, res) => {};

// Edit User Profile
const editUserProfile = async (req, res) => {};

module.exports = {
  userLogin,
  userRegister,
  userProfile,
};
