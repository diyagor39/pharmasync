/* ============================
   PharmaSync Backend - Order Model
   ============================ */

const pool = require("../config/db");

const createTableQuery = `
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_code VARCHAR(30) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  items JSON NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('Placed','Packed','Shipped','Delivered','Cancelled') DEFAULT 'Placed',
  address VARCHAR(255),
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`;

async function createTable() {
  await pool.query(createTableQuery);
}

async function createOrder({ orderCode, userId, items, total, address, paymentMethod }) {
  const [result] = await pool.query(
    "INSERT INTO orders (order_code, user_id, items, total, address, payment_method) VALUES (?, ?, ?, ?, ?, ?)",
    [orderCode, userId, JSON.stringify(items), total, address, paymentMethod]
  );
  return result.insertId;
}

async function getOrdersByUser(userId) {
  const [rows] = await pool.query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId]);
  return rows;
}

async function getAllOrders() {
  const [rows] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
  return rows;
}

module.exports = { createTable, createOrder, getOrdersByUser, getAllOrders };
