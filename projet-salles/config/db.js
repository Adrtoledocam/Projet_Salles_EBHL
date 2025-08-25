const mysql = require("mysql2");
const env = require("dotenv").config();

// Informations de connexion à la base de données de staging
function setDbConfig(host) {
  const pool = mysql.createPool({
    host: host,
    user: env.USER,
    password: env.PWD,
    port: env.PORT_DB,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool.promise();
}

const db_ebhl = setDbConfig(env.EB_HOST);
const db_cdg = setDbConfig(env.CDG_HOST);

module.exports = { db_ebhl, db_cdg };
