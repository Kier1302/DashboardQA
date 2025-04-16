const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// New endpoint to get current user details
router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from header
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    const user = await User.findById(decoded.id).select("-password"); // Fetch user without password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user); // Return user details
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;