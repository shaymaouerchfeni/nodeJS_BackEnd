const { number } = require("joi");
const mongoose = require("mongoose");

const trainingSchema = mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  numberHours: { type: Number },
  program: { type: String },
  level: { type: String },
  tags: [],
  createdAt: { type: Date, defualt: Date.now() },
});

module.exports = mongoose.model("Training", trainingSchema);
