const mysql = require("mysql2/promise");

require("dotenv").config();

function setDbConfig(host) {
  if (
    !process.env.DB_USER ||
    !process.env.DB_PWD ||
    !process.env.DB_PORT ||
    !process.env.DB_NAME
  ) {
    throw new Error("Impossible de charger les variables d'environnement.");
  }

  return mysql.createPool({
    host: host,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

const db_ebhl = setDbConfig(process.env.EB_HOST);
const db_cdg = setDbConfig(process.env.CDG_HOST);

module.exports = { db_ebhl, db_cdg };
