const mongoose = require("mongoose");

const Product = mongoose.model("Product", {
  date: { type: Date, default: Date.now() },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  user_email: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  tax_group: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  unit: {
    type: String,
  },
  code: { type: String, default: "", trim: true },
  notes: { type: String, trim: true },
  register: { type: String, trim: true },
  sort_order: { type: Number, trim: true },
  user_id: { type: String, trim: true, required: true },
});

module.exports = Product;
