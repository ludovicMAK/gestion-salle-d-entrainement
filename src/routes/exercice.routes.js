const express = require("express");
const router = express.Router();
const Exercice = require("../models/Exercice");
const ExerciceType = require("../models/ExerciceType");

// POST - Créer un exercice
router.post("/", async (req, res) => {
  try {
    const exercice = new Exercice(req.body);
    await exercice.save();
    res.status(201).json(exercice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET - Récupérer tous les exercices
router.get("/", async (req, res) => {
  try {
    const exercices = await Exercice.find({ actif: true })
      .populate("typeExercice", "nom description");
    res.json(exercices);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET - Récupérer les exercices par type
router.get("/type/:typeId", async (req, res) => {
  try {
    const exercices = await Exercice.find({ 
      typeExercice: req.params.typeId,
      actif: true 
    }).populate("typeExercice", "nom description");
    res.json(exercices);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET - Récupérer les exercices par niveau
router.get("/niveau/:niveau", async (req, res) => {
  try {
    const exercices = await Exercice.find({ 
      niveau: req.params.niveau,
      actif: true 
    }).populate("typeExercice", "nom description");
    res.json(exercices);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET - Récupérer un exercice par ID
router.get("/:id", async (req, res) => {
  try {
    const exercice = await Exercice.findById(req.params.id)
      .populate("typeExercice", "nom description");
    if (!exercice) {
      return res.status(404).json({ error: "Exercice non trouvé" });
    }
    res.json(exercice);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT - Mettre à jour un exercice
router.put("/:id", async (req, res) => {
  try {
    const updated = await Exercice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Exercice non trouvé" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH - Activer/Désactiver un exercice
router.patch("/:id/actif", async (req, res) => {
  try {
    const exercice = await Exercice.findByIdAndUpdate(
      req.params.id,
      { actif: req.body.actif },
      { new: true }
    );
    if (!exercice) {
      return res.status(404).json({ error: "Exercice non trouvé" });
    }
    res.json(exercice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Supprimer un exercice
router.delete("/:id", async (req, res) => {
  try {
    const result = await Exercice.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Exercice non trouvé" });
    }
    res.json({ message: "Exercice supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
