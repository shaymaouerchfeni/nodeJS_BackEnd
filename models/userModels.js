const { number } = require("joi");
const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  username: { type: String },
  email: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  phoneNumber: { type: Number },
  cardNumber: { type: Number },
  hourlyRate: { type: Number },
  picture: { type: String },
  cv: { type: String },
  speciality: { type: String },
  password: { type: String },
  role: { type: String },
  createdAt: { type: Date, defualt: Date.now() },
});

module.exports = mongoose.model("User", userSchema);
