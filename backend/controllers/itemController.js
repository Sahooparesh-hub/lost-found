const Item = require("../models/Item");

// CREATE ITEM
exports.createItem = async (req, res) => {
  try {

    const {
      name,
      description,
      category,
      location,
      owner,
      lostTime,
      image
    } = req.body;

    if (!name || !description || !location || !lostTime || !category) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    if (!owner.name || !owner.email || !owner.phone) {
      return res.status(400).json({
        message: "Owner details required"
      });
    }

    const item = await Item.create({
      user: req.user,
      name,
      description,
      category,
      location,
      owner,
      lostTime,
      image
    });

    res.status(201).json(item);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Item creation failed"
    });
  }
};


// GET ALL ITEMS
exports.getAllItems = async (req, res) => {

  try {

    const { category } = req.query;

    let filter = { status: "lost" };

    if (category) {
      filter.category = category;
    }

    const items = await Item.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(items);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch items"
    });
  }
};


// GET FOUND ITEMS
exports.getFoundItems = async (req, res) => {

  try {

    const { category } = req.query;

    let filter = { status: "found" };

    if (category) {
      filter.category = category;
    }

    const items = await Item.find(filter)
      .sort({ createdAt: -1 });

    res.json(items);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch found items"
    });
  }
};


// GET USER ITEMS
exports.getMyItems = async (req, res) => {

  try {

    const items = await Item.find({
      user: req.user
    }).sort({ createdAt: -1 });

    res.json(items);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch user items"
    });
  }
};