const express = require("express");
const router = express.Router();
const Salle = require("../models/Salle");

// GET - Tous les salles
router.get("/", async (req, res) => {
  try {
    const salles = await Salle.find();
    res.json(salles);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});



// POST - Créer une salle
router.post("/", async (req, res) => {
  try {
    const salle = new Salle(req.body);
    await salle.save();
    res.status(201).json(salle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT - Mettre à jour une salle
router.put("/:id", async (req, res) => {
  try {
    const updated = await Salle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ error: "Salle non trouvée" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH - Approuver/Désapprouver une salle
router.patch("/:id/approuvee", async (req, res) => {
  try {
    const salle = await Salle.findByIdAndUpdate(
      req.params.id,
      { approuvee: req.body.approuvee },
      { new: true }
    );
    if (!salle) return res.status(404).json({ error: "Salle non trouvée" });
    res.json(salle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Supprimer une salle
router.delete("/:id", async (req, res) => {
  try {
    const result = await Salle.findByIdAndDelete(req.params.id);
    if (!result)
      return res.status(404).json({ error: "Salle non trouvée" });
    res.json({ message: "Salle supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
