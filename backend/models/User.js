/* ============================
   PharmaSync Backend - User Model
   Run createTable() once (e.g. via a setup script) to create the table.
   ============================ */

const pool = require("../config/db");

const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('retailer','distributor','admin') NOT NULL DEFAULT 'retailer',
  store_name VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

async function createTable() {
  await pool.query(createTableQuery);
}

async function createUser({ name, email, hashedPassword, role, storeName }) {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role, store_name) VALUES (?, ?, ?, ?, ?)",
    [name, email, hashedPassword, role, storeName]
  );
  return result.insertId;
}

async function findUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
}

async function getAllUsers() {
  const [rows] = await pool.query("SELECT id, name, email, role, store_name, created_at FROM users");
  return rows;
}

module.exports = { createTable, createUser, findUserByEmail, getAllUsers };
