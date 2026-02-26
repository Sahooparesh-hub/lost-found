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
    lostTime: {                 // ✅ ADDED
      type: Date,
      required: true,
    },
    image: {
      type: String,
    },

    /* ✅ NEW FIELD */
    status: {
      type: String,
      enum: ["lost", "found"],
      default: "lost"
    }  
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);