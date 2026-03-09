const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const Item = require("../models/Item");


// CREATE ITEM
router.post("/", auth, async (req, res) => {

  try {

    const {
      name,
      description,
      category,
      location,
      image,
      lostTime,
      owner
    } = req.body;

    if (
      !name ||
      !description ||
      !category ||
      !location ||
      !lostTime ||
      !owner ||
      !owner.name ||
      !owner.email ||
      !owner.phone
    ) {
      return res.status(400).json({
        message: "All required fields must be filled"
      });
    }

    const item = await Item.create({
      user: req.user,
      name,
      description,
      category,
      owner,
      location,
      lostTime,
      image
    });

    res.status(201).json(item);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET LOST ITEMS (WITH CATEGORY FILTER)
router.get("/", async (req, res) => {

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

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET FOUND ITEMS
router.get("/found", async (req, res) => {

  try {

    const { category } = req.query;

    let filter = { status: "found" };

    if (category) {
      filter.category = category;
    }

    const items = await Item.find(filter)
      .sort({ createdAt: -1 });

    res.json(items);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET USER ITEMS
router.get("/my-items", auth, async (req, res) => {

  try {

    const items = await Item.find({
      user: req.user
    }).sort({ createdAt: -1 });

    res.json(items);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET SINGLE ITEM
router.get("/:id", async (req, res) => {

  try {

    const item = await Item.findById(req.params.id);

    if (!item)
      return res.status(404).json({
        message: "Item not found"
      });

    res.json(item);

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});


// DELETE ITEM
router.delete("/:id", auth, async (req, res) => {

  try {

    const item = await Item.findById(req.params.id);

    if (!item)
      return res.status(404).json({
        message: "Item not found"
      });

    if (!item.user.equals(req.user))
      return res.status(401).json({
        message: "Not authorized"
      });

    await item.deleteOne();

    res.json({
      message: "Item deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// MARK ITEM FOUND
router.put("/:id/found", auth, async (req, res) => {

  try {

    const item = await Item.findById(req.params.id);

    if (!item)
      return res.status(404).json({
        message: "Item not found"
      });

    item.status = "found";

    await item.save();

    res.json({
      message: "Item marked as found"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;