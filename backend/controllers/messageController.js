const Message = require("../models/Message");
const Item = require("../models/Item");

/**
 * SEND MESSAGE
 */
exports.sendMessage = async (req, res) => {
  try {
    const { itemId, name, contactInfo, message } = req.body;

    if (!itemId || !name || !contactInfo || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Sender from token
    const senderId = req.user;

    // Find item
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const receiverId = item.user;

    // Prevent self messaging
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "You cannot message yourself" });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      itemId,
      name,
      contactInfo,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully",
      messageId: newMessage._id,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * GET MY MESSAGES
 */
exports.getMyMessages = async (req, res) => {
  try {
    const userId = req.user;

    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId },
      ],
    })
      .populate("itemId", "title")
      .sort({ createdAt: -1 });

    res.json(messages);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};