const express = require("express");
const router = express.Router();
const fetchICSData = require("../server.js");

// Récupération de tous les événements d'une salle spécifique
router.get("/calendar/:site/:id", async (req, res) => {
  try {
    const { site, id } = req.params;
    const events = await fetchICSData(site, id);
    res.json(events.slice(0, 4));
  } catch (error) {
    console.error("Erreur lors de la récupération des données", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
