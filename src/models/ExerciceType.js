const exerciceTypeSchema = new mongoose.Schema({
  nom: String,
  description: String,
  musclesCibles: [String],
});
