/* ============================
   PharmaSync Backend - Prescription Controller
   Handles Rx upload record + pharmacist verification.
   (Actual file storage can be added later with multer + cloud storage;
   for now we store the file name/reference only.)
   ============================ */

const Prescription = require("../models/Prescription");

async function uploadPrescription(req, res) {
  try {
    const { fileName } = req.body;
    if (!fileName) {
      return res.status(400).json({ message: "No file provided." });
    }

    const rxCode = "RX" + Date.now().toString().slice(-8);
    await Prescription.createPrescription({ rxCode, userId: req.user.id, fileName });

    res.status(201).json({ message: "Prescription uploaded for verification.", rxCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not upload prescription." });
  }
}

async function verifyPrescription(req, res) {
  try {
    const { rxCode, approve } = req.body;
    await Prescription.updateStatus(rxCode, approve ? "Verified" : "Rejected", req.user.id);
    res.json({ message: `Prescription ${approve ? "verified" : "rejected"}.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update prescription status." });
  }
}

async function getMyPrescriptions(req, res) {
  try {
    const records = await Prescription.getPrescriptionsByUser(req.user.id);
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch prescriptions." });
  }
}

async function getPendingPrescriptions(req, res) {
  try {
    const records = await Prescription.getPendingPrescriptions();
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch pending prescriptions." });
  }
}

module.exports = { uploadPrescription, verifyPrescription, getMyPrescriptions, getPendingPrescriptions };
