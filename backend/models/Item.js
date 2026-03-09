const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    enum: [
      "Electronics",
      "Documents",
      "Clothing",
      "Accessories",
      "Bags",
      "Others",
    ],
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  owner: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },

  lostTime: {
    type: Date,
    required: true,
  },

  image: {
    type: String,
  },

  status: {
    type: String,
    enum: ["lost", "found"],
    default: "lost",
  },

},
{ timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);