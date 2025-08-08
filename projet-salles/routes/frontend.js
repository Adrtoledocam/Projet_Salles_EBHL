const express = require("express");
const path = require("path");
const router = express.Router();
const ICS_URLS = require("../public/controllers/ics-roomsData.js").ICS_URLS;

// Route pour servir la page principale selon le site et la salle
router.get("/:site/:room", (req, res) => {
  const { site, room } = req.params;
  if (!ICS_URLS[room] || ICS_URLS[room].site !== site) {
    return res.status(404).send("Erreur 404 : Salle ou site inconnu");
  }
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

module.exports = router;
