const mongoose = require("mongoose");

const Sell = mongoose.model("Sell", {
  //date: { type: Date, default: Date.now() },
  date: { type: Date, default: Date.now },
  product_name: {
    type: String,
    required: true,
    trim: true,
  },
  pos_id: {
    type: String,
    required: true,
    trim: true,
  },
  customer_id: {
    type: String,
    required: true,
    trim: true,
  },
  customer_name: { type: String, trim: true },
  amount: {
    type: Number,
    required: true,
    trim: true,
  },
  discount: {
    type: Number,
    required: true,
    trim: true,
  },
  net_amount: {
    type: Number,
    required: true,
    trim: true,
  },
  payment_mode: {
    type: String,
    required: true,
    trim: true,
    default: "cash",
  },
});

module.exports = Sell;
