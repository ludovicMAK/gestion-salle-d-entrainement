const defiSchema = new mongoose.Schema({
  titre: String,
  description: String,
  typeExercice: { type: mongoose.Schema.Types.ObjectId, ref: "ExerciceType" },
  difficulte: { type: String, enum: ["facile", "moyen", "difficile"] },
  objectifs: {
    repetitions: Number,
    calories: Number,
    dureeMinutes: Number,
  },
  salle: { type: mongoose.Schema.Types.ObjectId, ref: "Salle" },
  createur: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  statut: { type: String, enum: ["actif", "termine"], default: "actif" },
});
