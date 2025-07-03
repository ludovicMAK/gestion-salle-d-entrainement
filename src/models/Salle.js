const mongoose = require("mongoose");

const salleSchema = new mongoose.Schema({
  nom: String,
  adresse: String,
  capacite: Number,
  description: String,
  equipements: [String],
  niveaux: [String], // ['débutant', 'intermédiaire', 'avancé']
  approuvee: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  typesExercices: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ExerciceType" },
  ],
});

module.exports = mongoose.model("Salle", salleSchema);

