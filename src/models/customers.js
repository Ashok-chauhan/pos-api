const mongoose = require("mongoose");

const Customer = mongoose.model("Customer", {
  phone: {
    type: Number,
  },
  name: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  particular: { type: String },
  discount: { type: Number, default: 0 },
  total_amount: { type: Number },
  tax: { type: Number },
  invoice_number: { type: Number },
  date: { type: Date, default: Date.now() },
  category: { type: String },
});

module.exports = Customer;
