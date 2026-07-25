const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { getProducts, getProduct, addProduct, getExpiringProducts } = require("../controllers/productController");

router.get("/", getProducts);
router.get("/expiring", authMiddleware, getExpiringProducts);
router.get("/:id", getProduct);
router.post("/", authMiddleware, addProduct);

module.exports = router;
