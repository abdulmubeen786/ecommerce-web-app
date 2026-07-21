const express = require("express");
const adminProducts = express.Router();
const Product = require("../model/product");
const { protect, admin } = require("../middleware/authmiddleware");

adminProducts.get("/admin/products", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

module.exports = adminProducts;
