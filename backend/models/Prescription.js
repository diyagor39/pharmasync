/* ============================
   PharmaSync Backend - Prescription Model
   ============================ */

const pool = require("../config/db");

const createTableQuery = `
CREATE TABLE IF NOT EXISTS prescriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rx_code VARCHAR(30) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  file_name VARCHAR(255),
  status ENUM('Pending Review','Verified','Rejected') DEFAULT 'Pending Review',
  reviewed_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id)
);
`;

async function createTable() {
  await pool.query(createTableQuery);
}

async function createPrescription({ rxCode, userId, fileName }) {
  const [result] = await pool.query(
    "INSERT INTO prescriptions (rx_code, user_id, file_name) VALUES (?, ?, ?)",
    [rxCode, userId, fileName]
  );
  return result.insertId;
}

async function updateStatus(rxCode, status, reviewedBy = null) {
  await pool.query(
    "UPDATE prescriptions SET status = ?, reviewed_by = ? WHERE rx_code = ?",
    [status, reviewedBy, rxCode]
  );
}

async function getPrescriptionsByUser(userId) {
  const [rows] = await pool.query("SELECT * FROM prescriptions WHERE user_id = ? ORDER BY created_at DESC", [userId]);
  return rows;
}

async function getPendingPrescriptions() {
  const [rows] = await pool.query("SELECT * FROM prescriptions WHERE status = 'Pending Review' ORDER BY created_at ASC");
  return rows;
}

module.exports = { createTable, createPrescription, updateStatus, getPrescriptionsByUser, getPendingPrescriptions };
