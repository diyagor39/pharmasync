/* ============================
   PharmaSync Backend - Product Controller
   ============================ */

const Product = require("../models/Product");

async function getProducts(req, res) {
  try {
    const products = await Product.getAllProducts();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch products." });
  }
}

async function getProduct(req, res) {
  try {
    const product = await Product.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch product." });
  }
}

async function addProduct(req, res) {
  try {
    const { name, category, price, mrp, stock, expiryDate, rxRequired } = req.body;
    if (!name || !price || !mrp) {
      return res.status(400).json({ message: "Name, price and MRP are required." });
    }
    const id = await Product.createProduct({
      name, category, price, mrp, stock, expiryDate, rxRequired,
      distributorId: req.user.id
    });
    res.status(201).json({ message: "Product added.", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not add product." });
  }
}

async function getExpiringProducts(req, res) {
  try {
    const days = req.query.days || 120;
    const products = await Product.getExpiringProducts(days);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch expiring products." });
  }
}

module.exports = { getProducts, getProduct, addProduct, getExpiringProducts };
