const express = require("express");
const fetchData = require("./server.js");

const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`✅ http://localhost:${PORT}`);
});

// Récuperation de tous les événements d'une salle spécifique
app.get("/api/calendar/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const events = await fetchData(id);

    res.json(events.slice(0, 5));
  } catch (error) {
    console.error("Erreur lors de la récupération des données", error.message);
    res.status(500).json({ error: error.message });
  }
});
