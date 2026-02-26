const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists in DB
    const user = await User.findById(decoded.id).select("_id name");

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // Attach user info to request
    req.user = user._id;
    req.username = user.name;

    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};