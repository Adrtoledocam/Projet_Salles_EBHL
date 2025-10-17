const express = require("express");
const router = express.Router();
const { fetchICSData, fetchDBData } = require("../server.js");
const ROOMS_DATA = require("../public/controllers/roomsData.js").ROOMS_DATA;
const { db_ebhl, db_cdg } = require("../config/db.js");

// Fonction pour la gestion des erreurs
function sendError(res, status, message, details = null) {
  return res
    .status(status)
    .json({ status: "error", message, ...(details && { details }) });
}

// Récupération de tous les événements d'une salle spécifique
router.get("/calendar/:site/:room", async (req, res) => {
  const { site, room } = req.params;

  try {
    if (!site || !room) {
      return sendError(res, 400, "Paramètres 'site' et 'room' requis");
    }

    const roomData = ROOMS_DATA[room];
    if (!roomData) {
      return sendError(res, 404, `Salle inconnue : ${room}`);
    }

    // Récupération des événements depuis la DB pour EBHL/CDG
    if (!ROOMS_DATA[room]?.url) {
      let DB;
      switch (site) {
        case "ebhl":
          DB = db_ebhl;
          break;
        case "cdg":
          DB = db_cdg;
          break;
        default:
          return sendError(res, 400, `Site inconnu : ${site}`);
      }

      // Requête SQL pour récupérer les événements de la salle sélectionnée
      const query = `
      SELECT *
      FROM medhive.EH_BaseQuery_ResourcesEvents
      WHERE resource = ?
      `;

      try {
        const [dbEvents] = await DB.query(query, [roomData.salle]);
        const filteredEvents = await fetchDBData(dbEvents);
        res.json({ status: "success", data: filteredEvents });
      } catch (dbError) {
        console.error("[DB ERROR]", dbError);
        return sendError(
          res,
          500,
          "Erreur lors de la récupération des données SQL",
          dbError.message
        );
      }
    }

    // Récupération des événements depuis Exchange pour EBHL/PGA
    else if (site === "ebhl" || site === "pga") {
      try {
        const ICS_events = await fetchICSData(room);
        return res.json({ status: "success", data: ICS_events });
      } catch (icsError) {
        console.error("[ICS ERROR]", icsError);
        return sendError(
          res,
          500,
          "Erreur lors de la récupération des données ICS",
          icsError.message
        );
      }
    } else {
      return sendError(res, 400, `Site non pris en charge : ${site}`);
    }
  } catch (error) {
    console.error("[ROUTE ERROR]]", error);
    return sendError(res, 500, "Erreur interne du serveur", error.message);
  }
});

module.exports = router;
