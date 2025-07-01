const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom: String,
  email: { type: String, unique: true },
  motDePasse: String,
  role: {
    type: String,
    enum: ["super_admin", "owner", "user"],
    default: "user",
  },
  actif: { type: Boolean, default: true },
  score: { type: Number, default: 0 },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
});

module.exports = mongoose.model("User", userSchema);
