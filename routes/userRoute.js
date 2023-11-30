const express = require("express");
const auth = require("../routes/authRoute");
const User = require("../Modal/userModal");
const jwt = require("jsonwebtoken");
const router = express.Router();
// auth.protect,
router.route("/").post(auth.protect, async (req, res, next) => {
  try {
    const { username, name, password } = req.body;

    if (!username || !name || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide all fields",
      });
    }

    const newUser = await User.create({
      username,
      name,
      password,
    });

    return res.status(200).json({
      success: true,
      data: {
        name: newUser.name,
        username: newUser.username,
      },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: (err?.code === 11000 && "User name already exist") || err,
    });
  }
});

router.route("/login").post(async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!(user.password === password)) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
});

module.exports = router;
