const mysql = require("mysql2");

// Informations de connexion à la base de données de staging
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "db_test",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
