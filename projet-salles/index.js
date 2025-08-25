const express = require("express");
const app = express();

require("dotenv").config();

app.use(express.static("public"));

// Import des routes
const apiRoutes = require("./routes/api");
const frontendRoutes = require("./routes/frontend");

// Utilisation des routes
app.use("/api", apiRoutes);
app.use("/", frontendRoutes);

// Démarrage de l'application en local
app.listen(process.env.PORT, () => {
  console.log(`✅ http://localhost:${process.env.PORT}`);
});
