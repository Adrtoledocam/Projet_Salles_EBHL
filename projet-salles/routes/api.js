const express = require("express");
const router = express.Router();
const { fetchICSData, fetchDBData } = require("../server.js");
const db = require("../config/db");

// Récupération de tous les événements d'une salle spécifique
router.get("/calendar/:site/:room", async (req, res) => {
  try {
    const { site, room } = req.params;

    // Récupération des événements pour PGA
    if (site === "pga") {
      const ICS_events = await fetchICSData(room);
      res.json(ICS_events);
    }
    // Récupération des événements pour EBHL ou CDG
    else if (site === "ebhl" || site === "cdg") {
      const [DB_events] = await db.query(
        "SELECT * FROM t_room WHERE romRoom = ?",
        [room]
      );
      const filteredDB_events = await fetchDBData(DB_events);
      res.json(filteredDB_events);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
