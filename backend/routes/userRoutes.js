const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const bcrypt = require("bcryptjs");


// 🔹 GET PROFILE
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    console.error("GET Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// 🔹 UPDATE PROFILE (Full Update)
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Check email uniqueness if changed
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // ✅ Update allowed fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address !== undefined) user.address = address;

    // 🔐 Hash password if provided
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    });

  } catch (error) {
    console.error("UPDATE Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;