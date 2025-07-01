const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connecté à MongoDB");
  } catch (err) {
    console.error("❌ Connexion échouée :", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
