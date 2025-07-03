const express = require("express");
const router = express.Router();
const SeanceEntrainement = require("../models/SeanceEntrainement");

// POST - Créer une séance d'entraînement
router.post("/", async (req, res) => {
  try {
    const seance = new SeanceEntrainement(req.body);
    await seance.save();
    res.status(201).json(seance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET - Récupérer toutes les séances d'un utilisateur
router.get("/utilisateur/:userId", async (req, res) => {
  try {
    const seances = await SeanceEntrainement.find({ utilisateur: req.params.userId })
      .populate("salle", "nom adresse")
      .populate("exercices.exercice", "nom description typeExercice")
      .populate("defi", "titre description")
      .sort({ date: -1 });
    res.json(seances);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET - Récupérer une séance par ID
router.get("/:id", async (req, res) => {
  try {
    const seance = await SeanceEntrainement.findById(req.params.id)
      .populate("salle", "nom adresse")
      .populate("exercices.exercice", "nom description typeExercice")
      .populate("defi", "titre description");
    if (!seance) {
      return res.status(404).json({ error: "Séance non trouvée" });
    }
    res.json(seance);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT - Mettre à jour une séance
router.put("/:id", async (req, res) => {
  try {
    const updated = await SeanceEntrainement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Séance non trouvée" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Supprimer une séance
router.delete("/:id", async (req, res) => {
  try {
    const result = await SeanceEntrainement.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Séance non trouvée" });
    }
    res.json({ message: "Séance supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router; 