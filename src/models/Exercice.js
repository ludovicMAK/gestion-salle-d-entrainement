const mongoose = require("mongoose");

const exerciceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: String,
  typeExercice: { type: mongoose.Schema.Types.ObjectId, ref: "ExerciceType", required: true },
  musclesCibles: [String],
  equipements: [String], // ["haltères", "barre", "tapis de course"]
  niveau: { type: String, enum: ["débutant", "intermédiaire", "avancé"], default: "débutant" },
  instructions: String, // Instructions pour réaliser l'exercice
  actif: { type: Boolean, default: true }
});

module.exports = mongoose.model("Exercice", exerciceSchema); 