const mongoose = require("mongoose");

const Customer = mongoose.model("Customer", {
  phone: {
    type: Number,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  pos_id: { type: String, trim: true, required: true },
  email: { type: String },
  address: { type: String, default: "" },
  city: { type: String },
  pincode: { type: Number },
  date: { type: Date, default: Date.now() },
});

module.exports = Customer;
