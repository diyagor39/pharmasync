/* ============================
   PharmaSync Backend - Database Setup Script
   Run this ONCE after connecting to TiDB Cloud to create all tables:
     node setup.js
   Safe to re-run — uses CREATE TABLE IF NOT EXISTS.
   ============================ */

require("dotenv").config();
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Prescription = require("./models/Prescription");
const Redistribution = require("./models/Redistribution");

async function setup() {
  try {
    await User.createTable();
    console.log("✅ users table ready");
    await Product.createTable();
    console.log("✅ products table ready");
    await Order.createTable();
    console.log("✅ orders table ready");
    await Prescription.createTable();
    console.log("✅ prescriptions table ready");
    await Redistribution.createTable();
    console.log("✅ redistribution_listings table ready");

    console.log("\n🎉 All tables created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Setup failed:", err.message);
    process.exit(1);
  }
}

setup();
