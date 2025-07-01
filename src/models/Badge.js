const badgeSchema = new mongoose.Schema({
  nom: String,
  description: String,
  imageUrl: String,
  regle: {
    type: { type: String }, // ex: 'defis_reussis', 'participation'
    valeur: Number, // ex: 5
  },
});
