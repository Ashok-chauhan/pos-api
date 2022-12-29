const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  date_joined: { type: Date, default: Date.now() },
  last_login: { type: Date, default: Date.now() },
  password: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  first_name: { type: String, default: "", trim: true },
  last_name: { type: String, default: "", trim: true },
  is_staff: { type: String, default: "", trim: true },
  is_pos: { type: String, default: "", trim: true },
  is_superuser: { type: String, default: "", trim: true },
  is_active: { type: String, default: "", trim: true },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
