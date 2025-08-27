const express = require("express");
const router = express.Router();
const { fetchICSData, fetchDBData } = require("../server.js");
const ROOMS_DATA = require("../public/controllers/roomsData.js").ROOMS_DATA;
const { db_ebhl, db_cdg } = require("../config/db.js");

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

      // Requête SQL pour récupérer les événements de la salle sélectionée
      const query = `
      SELECT
        vc.name AS room,
        v.summary AS event,
        v.dtstart AS e_start,
        v.dtend AS e_end
      FROM medhive.vevent v
      JOIN medhive.resources r ON v.attendee = r.vcardid
      JOIN medhive.vcard vc ON r.vcardid = vc.id
      WHERE r.type = 3 AND vc.name = ?
      `;

      const [DBevents] = await DB.query(query, [ROOMS_DATA[room]?.salle]);

      const filteredDB_events = await fetchDBData(DBevents);
      res.json(filteredDB_events);
    }

    // Récupération des événements depuis Exchange pour EBHL/PGA
    else if (site === "ebhl" || site === "pga") {
      const ICS_events = await fetchICSData(room);
      res.json(ICS_events);
    }
  } catch (error) {
    console.error("Impossible de récupérer les données :", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
