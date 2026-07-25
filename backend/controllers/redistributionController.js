/* ============================
   PharmaSync Backend - Redistribution Controller
   ============================ */

const Redistribution = require("../models/Redistribution");

async function getListings(req, res) {
  try {
    const listings = await Redistribution.getAllListings();
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch listings." });
  }
}

async function createListing(req, res) {
  try {
    const { productId, quantity, discountPct } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product and quantity are required." });
    }

    const listingCode = "RD" + Date.now().toString().slice(-8);
    await Redistribution.createListing({
      listingCode,
      productId,
      listedBy: req.user.id,
      quantity,
      discountPct: discountPct || 25
    });

    res.status(201).json({ message: "Listed on redistribution marketplace.", listingCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create listing." });
  }
}

async function claimListing(req, res) {
  try {
    const { listingCode } = req.body;
    await Redistribution.claimListing(listingCode, req.user.id);
    res.json({ message: "Listing claimed. Contact the retailer to arrange pickup." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not claim listing." });
  }
}

module.exports = { getListings, createListing, claimListing };
