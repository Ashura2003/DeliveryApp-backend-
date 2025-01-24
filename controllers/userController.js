const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

// User Login
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        cartData: user.cartData,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

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
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    if (!validator.isMobilePhone(phone)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Phone Number" });
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

    const user = await newUser.save();

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      userData: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// User Profile
const userProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Edit User Profile
const editUserProfile = async (req, res) => {
  const { username, email, phone } = req.body;

  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.username = username;
    user.email = email;
    user.phone = phone;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  userLogin,
  userRegister,
  userProfile,
  editUserProfile,
  userProfile,
};
