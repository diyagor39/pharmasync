const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const { createOrder, getMyOrders, getAllOrders } = require("../controllers/orderController");

router.post("/", authMiddleware, createOrder);
router.get("/my", authMiddleware, getMyOrders);
router.get("/all", authMiddleware, requireRole("admin", "distributor"), getAllOrders);

module.exports = router;
