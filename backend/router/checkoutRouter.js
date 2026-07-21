const express = require("express");
const checkoutRouter = express.Router();
const Cart = require("../model/Cart");
const Product = require("../model/product");
const Order = require("../model/order");
const Checkout = require("../model/checkout");
const { protect } = require("../middleware/authmiddleware");

checkoutRouter.post("/checkout", protect, async (req, res) => {
  const { paymentMethod, checkoutItems, totalPrice, shippingAddress } =
    req.body;
  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(404).json({ message: "checkout list empty" });
  }

  try {
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: "Pending",
      totalPrice,
      isPaid: false,
    });
    console.log(`checkout created for user ${req.user._id}`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

checkoutRouter.put("/checkout/:id/pay", protect, async (req, res) => {
  const { paymentDetail, paymentStatus } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "checkout item not found" });
    }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetail;
      checkout.paidAt = Date.now();

      await checkout.save();
      res.status(200).json(checkout);
    } else {
      res.status(404).json({ message: "payment method failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

// finalize checkout and connvert to order payment after confirmation;
checkoutRouter.post("/checkout/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) return res.status(404).json({ message: "user not found" });

    if (checkout.isPaid && !checkout.isFinalized) {
      // create final order base on the checkout detail;
      const finalOrder = await Order.create({
        user: checkout.user,
        orderitems: checkout.checkoutItems,
        paymentMethod: checkout.paymentMethod,
        shippingAddress: checkout.shippingAddress,
        paymentDetails: checkout.paymentDetails,
        paymentStatus: "Paid",
        totalPrice: checkout.totalPrice,
        isPaid: true,
        isDelivered: false,
        paidAt: checkout.paidAt,
      });
      // mark the check out as isFinalized
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();
      // delete the cart associated with the user;
      await Cart.findOneAndDelete({ user: checkout.user });
      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      return res
        .status(400)
        .json({ message: "check out is already finalized" });
    } else {
      return res.status(404).json({ message: "checkout not finalized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server" });
  }
});

module.exports = checkoutRouter;
