const mongoose = require("mongoose");

const exerciceSeanceSchema = new mongoose.Schema({
  exercice: { type: mongoose.Schema.Types.ObjectId, ref: "Exercice", required: true },
  repetitions: Number,
  series: Number,
  poids: Number, // en kg
  dureeMinutes: Number,
  calories: Number
});

const seanceEntrainementSchema = new mongoose.Schema({
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  salle: { type: mongoose.Schema.Types.ObjectId, ref: "Salle" },
  date: { type: Date, default: Date.now },
  dureeMinutes: { type: Number, required: true },
  caloriesBrulees: { type: Number, required: true },
  exercices: [exerciceSeanceSchema], // Plusieurs exercices avec leurs détails
  description: String,
  niveau: { type: String, enum: ["débutant", "intermédiaire", "avancé"] },
  defi: { type: mongoose.Schema.Types.ObjectId, ref: "Defi" }, // Optionnel, si la séance fait partie d'un défi
  notes: String
});

module.exports = mongoose.model("SeanceEntrainement", seanceEntrainementSchema); 