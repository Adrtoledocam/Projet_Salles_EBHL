const mysql = require("mysql2");

require("dotenv").config();

// Informations de connexion à la base de données de staging
function setDbConfig(host) {
  const pool = mysql.createPool({
    host: host,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool.promise();
}

const db_ebhl = setDbConfig(process.env.EB_HOST);
const db_cdg = setDbConfig(process.env.CDG_HOST);

module.exports = { db_ebhl, db_cdg };
