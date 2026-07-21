const express = require("express");
const webhookRouter = express.Router();
const Stripe = require("stripe");
const Checkout = require("../model/checkout");
const Order = require("../model/order");
const Cart = require("../model/Cart");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// ⚠️ IMPORTANT: is route ko raw body chahiye, JSON-parsed nahi (neeche app.js note dekho)
webhookRouter.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const checkoutId = session.metadata?.checkoutId;

      try {
        const checkout = await Checkout.findById(checkoutId);
        if (!checkout) {
          console.error("Webhook: checkout not found:", checkoutId);
          return res.status(200).json({ received: true });
        }

        // Step 2: mark as paid (agar already paid nahi hai)
        if (!checkout.isPaid) {
          checkout.isPaid = true;
          checkout.paymentStatus = "paid";
          checkout.paymentDetails = {
            id: session.payment_intent,
            status: session.payment_status,
            email: session.customer_details?.email,
          };
          checkout.paidAt = Date.now();
          await checkout.save();
        }

        // Step 3: finalize → order create + cart delete
        if (checkout.isPaid && !checkout.isFinalized) {
          await Order.create({
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

          checkout.isFinalized = true;
          checkout.finalizedAt = Date.now();
          await checkout.save();

          await Cart.findOneAndDelete({ user: checkout.user });
        }
      } catch (err) {
        console.error("Webhook processing error:", err);
      }
    }

    res.status(200).json({ received: true });
  },
);

module.exports = webhookRouter;
