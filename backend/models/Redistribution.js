/* ============================
   PharmaSync Backend - Redistribution Model
   Near-expiry stock marketplace listings.
   ============================ */

const pool = require("../config/db");

const createTableQuery = `
CREATE TABLE IF NOT EXISTS redistribution_listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_code VARCHAR(30) NOT NULL UNIQUE,
  product_id INT NOT NULL,
  listed_by INT NOT NULL,
  quantity INT NOT NULL,
  discount_pct INT DEFAULT 25,
  status ENUM('Available','Claimed') DEFAULT 'Available',
  claimed_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (listed_by) REFERENCES users(id),
  FOREIGN KEY (claimed_by) REFERENCES users(id)
);
`;

async function createTable() {
  await pool.query(createTableQuery);
}

async function createListing({ listingCode, productId, listedBy, quantity, discountPct }) {
  const [result] = await pool.query(
    "INSERT INTO redistribution_listings (listing_code, product_id, listed_by, quantity, discount_pct) VALUES (?, ?, ?, ?, ?)",
    [listingCode, productId, listedBy, quantity, discountPct]
  );
  return result.insertId;
}

async function getAllListings() {
  const [rows] = await pool.query(`
    SELECT rl.*, p.name AS product_name, u.store_name AS listed_by_name
    FROM redistribution_listings rl
    JOIN products p ON rl.product_id = p.id
    JOIN users u ON rl.listed_by = u.id
    ORDER BY rl.created_at DESC
  `);
  return rows;
}

async function claimListing(listingCode, claimedBy) {
  await pool.query(
    "UPDATE redistribution_listings SET status = 'Claimed', claimed_by = ? WHERE listing_code = ?",
    [claimedBy, listingCode]
  );
}

module.exports = { createTable, createListing, getAllListings, claimListing };
