const Item = require("../models/Item");

// CREATE ITEM
exports.createItem = async (req, res) => {
  try {
    const { name, description, location, owner, lostTime, image } = req.body;

    // Basic validation
    if (!name || !description || !location || !owner || !lostTime) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (!owner.name || !owner.email || !owner.phone) {
      return res.status(400).json({ message: "Owner details are required" });
    }

    const item = await Item.create({
      user: req.user,
      name,
      description,
      location,
      owner,
      lostTime,
      image,
    });

    res.status(201).json(item);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Item creation failed" });
  }
};

// GET ALL ITEMS
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("user", "name email");

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

// GET USER ITEMS
exports.getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user items" });
  }
};