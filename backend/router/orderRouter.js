const express = require("express");
const orderRoute = express.Router();
const Order = require("../model/order");
const order = require("../model/order");
const { protect } = require("../middleware/authmiddleware");

orderRoute.get("/my-order", protect, async (req, res) => {
  try {
    const order = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

orderRoute.get("/order/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (!order) {
      return res.status(404).json("order not found");
    }
    res.status(200).json(order);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "server error" });
  }
});

module.exports = orderRoute;
