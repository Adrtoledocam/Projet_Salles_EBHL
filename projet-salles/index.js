const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.static("public"));

// Import des routes
const apiRoutes = require("./routes/api");
const frontendRoutes = require("./routes/frontend");

// Utilisation des routes
app.use("/api", apiRoutes);
app.use("/", frontendRoutes);

app.listen(PORT, () => {
  console.log(`✅ http://localhost:${PORT}`);
});
