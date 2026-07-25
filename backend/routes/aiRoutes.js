const express = require("express");
const router = express.Router();
const { checkSafety } = require("../controllers/aiController");

router.post("/check", checkSafety);

module.exports = router;
