const mongoose = require("mongoose");

const trainingSessionsSchema = mongoose.Schema({
  training: { type: Object },
  instructor: [],
  startDate: { type: String },
  endDate: { type: String },
  students: [],
  createdAt: { type: Date, defualt: Date.now() },
});

module.exports = mongoose.model("TrainingSession", trainingSessionsSchema);
