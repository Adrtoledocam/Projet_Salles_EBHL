const express = require("express");
const helmet = require("helmet");
const app = express();
const PORT = process.env.PORT || 3000;

// Sécurité HTTP avec Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        frameSrc: ["'self'", "https://www.zeitverschiebung.net"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        connectSrc: ["'self'", "https://cdn.jsdelivr.net"],
      },
    },
  })
);
app.use(express.static("public"));

// Import des routes
const apiRoutes = require("./routes/api");
const frontendRoutes = require("./routes/frontend");

// Utilisation des routes
app.use("/api", apiRoutes);
app.use("/", frontendRoutes);

// Démarrage de l'application
app.listen(PORT, () => {});
