const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Item = require("../models/Item");


/*
  @route   POST /api/items
  @desc    Create new item
  @access  Private
*/
router.post("/", auth, async (req, res) => {
  try {
    const { name, description, location, image, lostTime, owner } = req.body;

    // Validation
    if (
      !name ||
      !description ||
      !location ||
      !lostTime ||
      !owner ||
      !owner.name ||
      !owner.email ||
      !owner.phone
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const item = await Item.create({
      user: req.user,
      name,
      description,
      owner,
      location,
      lostTime,
      image,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/*
  @route   GET /api/items/found
  @desc    Get all found items
  @access  Public
*/
router.get("/found", async (req, res) => {
  try {
    const items = await Item.find({ status: "found" })
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*
  @route   GET /api/items/my-items
  @desc    Get logged-in user's items
  @access  Private
*/
router.get("/my-items", auth, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user })
    .sort({
      createdAt: -1,
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*
  @route   GET /api/items
  @desc    Get all items
  @access  Public
*/
router.get("/", async (req, res) => {
  try {
    const items = await Item.find({ status: "lost" })
  .populate("user", "name email")
  .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*
  @route   DELETE /api/items/:id
  @desc    Delete item
  @access  Private
*/
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item)
      return res.status(404).json({ message: "Item not found" });

    if (!item.user.equals(req.user))
      return res.status(401).json({ message: "Not authorized" });

    await item.deleteOne();

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*
  @route   PUT /api/items/:id/found
  @desc    Mark item as found
  @access  Private
*/
router.put("/:id/found", auth, async (req, res) => {
  try {
    console.log("Mark found route hit");

    const item = await Item.findById(req.params.id);

    if (!item) {
      console.log("Item not found");
      return res.status(404).json({ message: "Item not found" });
    }

    console.log("Before update:", item.status);

    item.status = "found";
    await item.save();

    console.log("After update:", item.status);

    res.json({ message: "Item marked as found" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;

// GET single item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
