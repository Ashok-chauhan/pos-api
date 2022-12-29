const mongoose = require("mongoose");

const Payment = mongoose.model("Payment", {
  date: { type: Date, default: Date.now() },
  sell_id: {
    type: String,
    required: true,
    trim: true,
  },
  pos_id: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    trim: true,
  },
  method: {
    cash: { type: String, default: "" },
    card: { type: String, default: "" },

    required: true,
    trim: true,
  },
});

module.exports = Payment;
