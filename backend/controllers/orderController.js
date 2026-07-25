/* ============================
   PharmaSync Backend - Order Controller
   ============================ */

const Order = require("../models/Order");

async function createOrder(req, res) {
  try {
    const { items, total, address, paymentMethod } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const orderCode = "ORD" + Date.now().toString().slice(-8);
    const id = await Order.createOrder({
      orderCode,
      userId: req.user.id,
      items,
      total,
      address,
      paymentMethod
    });

    res.status(201).json({ message: "Order placed successfully.", id, orderCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not place order." });
  }
}

async function getMyOrders(req, res) {
  try {
    const orders = await Order.getOrdersByUser(req.user.id);
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch orders." });
  }
}

async function getAllOrders(req, res) {
  try {
    const orders = await Order.getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch orders." });
  }
}

module.exports = { createOrder, getMyOrders, getAllOrders };
