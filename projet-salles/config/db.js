const mysql = require("mysql2");

// Informations de connexion à la base de données de staging
function setDbConfig(host, database) {
  const pool = mysql.createPool({
    host: host,
    user: "root",
    password: "root",
    database: database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  return pool.promise();
}

module.exports = setDbConfig;
