const mongoose = require("mongoose");

const exerciceTypeSchema = new mongoose.Schema({
  nom: String,
  description: String,
  musclesCibles: [String],
});

module.exports = mongoose.model("exerciceType", exerciceTypeSchema);
