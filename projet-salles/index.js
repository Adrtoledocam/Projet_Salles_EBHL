const fetchICSData = require("./server.js");
const express = require("express");
const path = require("path");
const ICS_URLS = require("./public/resources/scripts/icsURL.js").ICS_URLS;

const app = express();
const PORT = 3000;

app.use(express.static("public"));

// Récuperation de tous les événements d'une salle spécifique
app.get("/api/calendar/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const events = await fetchICSData(id);

    res.json(events.slice(0, 4));
  } catch (error) {
    console.error("Erreur lors de la récupération des données", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/:roomId", (req, res) => {
  const roomId = req.params.roomId;

  if (!ICS_URLS[roomId]) {
    return res.status(404).send("Erreur 404 : Salle inconnue");
  }

  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ http://localhost:${PORT}`);
});
