/* ============================
   PharmaSync Backend - Database Connection
   Connects to TiDB Cloud (MySQL compatible).
   Same pattern used in FF Weddingz.
   ============================ */

const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 4000,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Quick connection test (runs once on startup, logs success/failure)
pool.getConnection()
  .then((conn) => {
    console.log("✅ Connected to TiDB Cloud (pharmasync_db)");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });

module.exports = pool;
