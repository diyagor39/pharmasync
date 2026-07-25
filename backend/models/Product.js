/* ============================
   PharmaSync Backend - Product Model
   ============================ */

const pool = require("../config/db");

const createTableQuery = `
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  mrp DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  expiry_date DATE,
  rx_required BOOLEAN DEFAULT FALSE,
  distributor_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (distributor_id) REFERENCES users(id)
);
`;

async function createTable() {
  await pool.query(createTableQuery);
}

async function getAllProducts() {
  const [rows] = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
  return rows;
}

async function getProductById(id) {
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
  return rows[0];
}

async function createProduct(data) {
  const { name, category, price, mrp, stock, expiryDate, rxRequired, distributorId } = data;
  const [result] = await pool.query(
    "INSERT INTO products (name, category, price, mrp, stock, expiry_date, rx_required, distributor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [name, category, price, mrp, stock, expiryDate, rxRequired, distributorId]
  );
  return result.insertId;
}

async function getExpiringProducts(daysThreshold = 120) {
  const [rows] = await pool.query(
    "SELECT * FROM products WHERE expiry_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY) ORDER BY expiry_date ASC",
    [daysThreshold]
  );
  return rows;
}

module.exports = { createTable, getAllProducts, getProductById, createProduct, getExpiringProducts };
