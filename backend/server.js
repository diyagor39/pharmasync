/* ============================
   PharmaSync Backend - Server Entry Point
   ============================ */

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const redistributionRoutes = require("./routes/redistributionRoutes");
const aiRoutes = require("./routes/aiRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/redistribution", redistributionRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("PharmaSync backend is running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`PharmaSync backend running on port ${PORT}`);
});
