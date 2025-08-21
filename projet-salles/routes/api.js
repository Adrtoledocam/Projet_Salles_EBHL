const express = require("express");
const router = express.Router();
const { fetchICSData, fetchDBData } = require("../server.js");
const { db_ebhl, db_cdg } = require("../config/db");
const ROOMS_DATA = require("../public/controllers/roomsData.js").ROOMS_DATA;

// Récupération de tous les événements d'une salle spécifique
router.get("/calendar/:site/:room", async (req, res) => {
  try {
    const { site, room } = req.params;

    // Récupération des événements depuis la DB pour EBHL/CDG
    if (!ROOMS_DATA[room]?.url) {
      let DB = "";
      if (site == "ebhl") {
        DB = db_ebhl;
      } else if (site == "cdg") {
        DB = db_cdg;
      }

      const [DBevents] = await DB.query(
        "SELECT * FROM t_room WHERE romRoom = ?",
        [room]
      );

      const filteredDB_events = await fetchDBData(DBevents);
      res.json(filteredDB_events);
    }

    // Récupération des événements depuis Exchange pour EBHL/PGA
    else if (site === "ebhl" || site === "pga") {
      const ICS_events = await fetchICSData(room);
      res.json(ICS_events);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
