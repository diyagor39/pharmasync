const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const {
  uploadPrescription,
  verifyPrescription,
  getMyPrescriptions,
  getPendingPrescriptions
} = require("../controllers/prescriptionController");

router.post("/upload", authMiddleware, uploadPrescription);
router.post("/verify", authMiddleware, requireRole("admin"), verifyPrescription);
router.get("/my", authMiddleware, getMyPrescriptions);
router.get("/pending", authMiddleware, requireRole("admin"), getPendingPrescriptions);

module.exports = router;
