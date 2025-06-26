const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/monapp';

mongoose.connect(mongoUrl)
  .then(() => console.log("✅ Connexion à MongoDB réussie"))
  .catch(err => console.error("❌ Erreur de connexion MongoDB:", err));

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('API Node.js fonctionne 🟢');
});

app.listen(port, () => {
  console.log(`🚀 Serveur Node lancé sur http://localhost:${port}`);
});
