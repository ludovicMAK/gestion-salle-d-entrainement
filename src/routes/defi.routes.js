const express = require("express");
const router = express.Router();
const Defi = require("../models/Defi");
const SuiviDefi = require("../models/SuiviDefi");

// POST - Créer un défi
router.post("/", async (req, res) => {
  try {
    const defi = new Defi(req.body);
    await defi.save();
    res.status(201).json(defi);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET - Récupérer tous les défis
router.get("/", async (req, res) => {
  try {
    const defis = await Defi.find()
      .populate("exercices", "nom description typeExercice")
      .populate("salle", "nom adresse")
      .populate("createur", "nom email");
    res.json(defis);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET - Récupérer un défi par ID
router.get("/:id", async (req, res) => {
  try {
    const defi = await Defi.findById(req.params.id)
      .populate("exercices", "nom description typeExercice")
      .populate("salle", "nom adresse")
      .populate("createur", "nom email")
      .populate("participants", "nom email");
    if (!defi) {
      return res.status(404).json({ error: "Défi non trouvé" });
    }
    res.json(defi);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT - Mettre à jour un défi
router.put("/:id", async (req, res) => {
  try {
    const updated = await Defi.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Défi non trouvé" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH - Changer le statut d'un défi (actif/terminé)
router.patch("/:id/statut", async (req, res) => {
  try {
    const defi = await Defi.findByIdAndUpdate(
      req.params.id,
      { statut: req.body.statut },
      { new: true }
    );
    if (!defi) {
      return res.status(404).json({ error: "Défi non trouvé" });
    }
    res.json(defi);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST - Rejoindre un défi
router.post("/:id/rejoindre", async (req, res) => {
  try {
    const defi = await Defi.findById(req.params.id);
    if (!defi) {
      return res.status(404).json({ error: "Défi non trouvé" });
    }
    
    if (defi.participants.includes(req.body.utilisateurId)) {
      return res.status(400).json({ error: "Utilisateur déjà participant" });
    }
    
    defi.participants.push(req.body.utilisateurId);
    await defi.save();
    res.json(defi);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Supprimer un défi
router.delete("/:id", async (req, res) => {
  try {
    const result = await Defi.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Défi non trouvé" });
    }
    res.json({ message: "Défi supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router; 