const mysql = require("mysql2");

// Informations de connexion à la base de données de staging
function setDbConfig(host) {
  const pool = mysql.createPool({
    host: host,
    user: "",
    password: "",
    port: 3306,
    database: "",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool.promise();
}

const db_ebhl = setDbConfig("");
const db_cdg = setDbConfig("");

module.exports = { db_ebhl, db_cdg };
