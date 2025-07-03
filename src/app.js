const express = require("express");
const userRoutes = require("./routes/user.routes");
const salleRoutes = require("./routes/salle.routes");
const exerciceRoutes = require("./routes/exercice.routes");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🏋️ API Salle d'Entraînement opérationnelle");
});

app.use("/api/users", userRoutes);
app.use("/api/salles", salleRoutes);
app.use("/api/exercices", exerciceRoutes);
module.exports = app;
