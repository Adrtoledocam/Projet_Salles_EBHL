const express = require("express");
const helmet = require("helmet");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.static("public"));

// Import des routes
const apiRoutes = require("./routes/api");
const frontendRoutes = require("./routes/frontend");

// Utilisation des routes
app.use("/api", apiRoutes);
app.use("/", frontendRoutes);

// Démarrage de l'application en local
app.listen(PORT, () => {
  console.log(`✅ Port: ${PORT}`);
});
