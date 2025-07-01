const suiviDefiSchema = new mongoose.Schema({
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  defi: { type: mongoose.Schema.Types.ObjectId, ref: "Defi" },
  date: Date,
  calories: Number,
  progression: String, // ex: "terminé", "en cours"
  notePerso: String,
});
