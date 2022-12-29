const mongoose = require("mongoose");

const Category = mongoose.model("Category", {
  date: { type: Date, default: Date.now() },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  pos_email: {
    type: String,
    required: true,
    trim: true,
  },
  pos_id: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = Category;
