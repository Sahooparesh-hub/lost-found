const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const messageController = require("../controllers/messageController");

// Send message
router.post("/send", auth, messageController.sendMessage);

// Get my messages
router.get("/my-messages", auth, messageController.getMyMessages);

module.exports = router;