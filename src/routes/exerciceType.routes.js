const express = require("express");
const router = express.Router();
const ExerciceType = require("../models/ExerciceType");

// POST - Créer un type d'exercice
router.post("/", async (req, res) => {
  try {
    const exerciceType = new ExerciceType(req.body);
    await exerciceType.save();
    res.status(201).json(exerciceType);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET - Récupérer tous les types d'exercices
router.get("/", async (req, res) => {
  try {
    const exerciceTypes = await ExerciceType.find();
    res.json(exerciceTypes);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET - Récupérer un type d'exercice par ID
router.get("/:id", async (req, res) => {
  try {
    const exerciceType = await ExerciceType.findById(req.params.id);
    if (!exerciceType) {
      return res.status(404).json({ error: "Type d'exercice non trouvé" });
    }
    res.json(exerciceType);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT - Mettre à jour un type d'exercice
router.put("/:id", async (req, res) => {
  try {
    const updated = await ExerciceType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Type d'exercice non trouvé" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Supprimer un type d'exercice
router.delete("/:id", async (req, res) => {
  try {
    const result = await ExerciceType.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Type d'exercice non trouvé" });
    }
    res.json({ message: "Type d'exercice supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router; 