const express = require("express");
const userRoutes = require("./routes/user.routes");
const salleRoutes = require("./routes/salle.routes");
const exerciceRoutes = require("./routes/exercice.routes");
const exerciceTypeRoutes = require("./routes/exerciceType.routes");
const seanceRoutes = require("./routes/seance.routes");
const defiRoutes = require("./routes/defi.routes");
const suiviDefiRoutes = require("./routes/suiviDefi.routes");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🏋️ API Salle d'Entraînement opérationnelle");
});

app.use("/api/users", userRoutes);
app.use("/api/salles", salleRoutes);
app.use("/api/exercices", exerciceRoutes);
app.use("/api/exercice-types", exerciceTypeRoutes);
app.use("/api/seances", seanceRoutes);
app.use("/api/defis", defiRoutes);
app.use("/api/suivi-defis", suiviDefiRoutes);

module.exports = app;
