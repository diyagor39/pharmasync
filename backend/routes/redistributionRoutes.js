const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { getListings, createListing, claimListing } = require("../controllers/redistributionController");

router.get("/", getListings);
router.post("/", authMiddleware, createListing);
router.post("/claim", authMiddleware, claimListing);

module.exports = router;
