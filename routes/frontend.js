const express = require("express");
const path = require("path");
const router = express.Router();
const ROOMS_DATA = require("../public/controllers/roomsData.js").ROOMS_DATA;

// Route pour servir la page principale selon le site et la salle sélectionnée
router.get("/:site/:room", (req, res) => {
  const { site, room } = req.params;
  if (!ROOMS_DATA[room] || ROOMS_DATA[room].site !== site) {
    return res.status(404).send("Erreur 404 : Salle ou site inconnu");
  }
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

module.exports = router;
