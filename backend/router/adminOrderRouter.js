const express = require("express");
const adminOrderRoute = express.Router();
const Order = require("../model/order");
const { protect, admin } = require("../middleware/authmiddleware");

// get all orders detail by admin

adminOrderRoute.get("/admin/order", protect, admin, async (req, res) => {
  try {
    const order = await Order.find({}).populate("user", "name email");
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

adminOrderRoute.put("/admin/order/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");
    if (order) {
      order.status = req.body.status || order.status;
      order.isDelivered =
        req.body.status === "Delivered" ? true : order.isDelivered;
      order.deliveredAt =
        req.body.status === "Delivered" ? Date.now() : order.deliveredAt;
      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404).json({ message: "order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

adminOrderRoute.delete("/admin/order/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.status(200).json(req.params.id);
    } else {
      res.status(404).json({ message: "order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});
module.exports = adminOrderRoute;
