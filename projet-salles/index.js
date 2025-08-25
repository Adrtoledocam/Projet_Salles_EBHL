const express = require("express");
const env = require("dotenv").config();
const app = express();

app.use(express.static("public"));

// Import des routes
const apiRoutes = require("./routes/api");
const frontendRoutes = require("./routes/frontend");

// Utilisation des routes
app.use("/api", apiRoutes);
app.use("/", frontendRoutes);

// Démarrage de l'application en local
app.listen(env.PORT, () => {
  console.log(`✅ http://localhost:${env.PORT}`);
});
