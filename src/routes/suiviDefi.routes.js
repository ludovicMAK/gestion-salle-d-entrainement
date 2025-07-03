const express = require("express");
const router = express.Router();
const SuiviDefi = require("../models/SuiviDefi");
const Defi = require("../models/Defi");

// POST - Créer un suivi de défi
router.post("/", async (req, res) => {
  try {
    const suivi = new SuiviDefi(req.body);
    await suivi.save();
    res.status(201).json(suivi);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET - Historique des défis d'un utilisateur
router.get("/utilisateur/:userId", async (req, res) => {
  try {
    const historique = await SuiviDefi.find({ utilisateur: req.params.userId })
      .populate("defi", "titre description difficulte objectifs")
      .sort({ date: -1 });
    res.json(historique);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET - Suivi d'un défi spécifique pour un utilisateur
router.get("/utilisateur/:userId/defi/:defiId", async (req, res) => {
  try {
    const suivi = await SuiviDefi.findOne({
      utilisateur: req.params.userId,
      defi: req.params.defiId
    }).populate("defi", "titre description difficulte objectifs");
    
    if (!suivi) {
      return res.status(404).json({ error: "Suivi non trouvé" });
    }
    res.json(suivi);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET - Tous les participants d'un défi avec leur progression
router.get("/defi/:defiId/participants", async (req, res) => {
  try {
    const participants = await SuiviDefi.find({ defi: req.params.defiId })
      .populate("utilisateur", "nom email")
      .populate("defi", "titre description objectifs");
    res.json(participants);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT - Mettre à jour la progression d'un défi
router.put("/:id", async (req, res) => {
  try {
    const updated = await SuiviDefi.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Suivi non trouvé" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH - Mettre à jour la progression (en cours/terminé)
router.patch("/:id/progression", async (req, res) => {
  try {
    const suivi = await SuiviDefi.findByIdAndUpdate(
      req.params.id,
      { progression: req.body.progression },
      { new: true }
    );
    if (!suivi) {
      return res.status(404).json({ error: "Suivi non trouvé" });
    }
    res.json(suivi);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Supprimer un suivi
router.delete("/:id", async (req, res) => {
  try {
    const result = await SuiviDefi.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Suivi non trouvé" });
    }
    res.json({ message: "Suivi supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router; 