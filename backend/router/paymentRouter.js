const express = require("express");
const paymentRoute = express.Router();
const Stripe = require("stripe");
const Checkout = require("../model/checkout");
const { protect } = require("../middleware/authmiddleware");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

paymentRoute.post("/checkout/payment", protect, async (req, res) => {
  const { checkoutId } = req.body;

  try {
    const checkout = await Checkout.findById(checkoutId);
    if (!checkout) {
      return res.status(404).json({ message: "checkout not found" });
    }

    // ✅ ownership check — sirf apna checkout pay kar sake
    if (checkout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "not authorized" });
    }

    if (checkout.isPaid) {
      return res.status(400).json({ message: "checkout already paid" });
    }

    // ✅ cart ke saare items se line_items banao (single product nahi)
    const line_items = checkout.checkoutItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image?.url ? [item.image.url] : [], // ✅ single object se array
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      // ✅ swapped urls fix + session_id pass taake confirmation page verify kar sake
      success_url: `${process.env.CLIENT_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      // ✅ metadata — webhook ko batayega konsa checkout hai
      metadata: {
        checkoutId: checkout._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = paymentRoute;

// const express = require("express");
// const paymentRoute = express.Router();
// const Stripe = require("stripe");

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// paymentRoute.post("/checkout/payment", async (req, res) => {
//   try {
//     const { product } = req.body;
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: product.name,
//               images: [product.images],
//             },
//             unit_amount: product.price * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/cancel`,
//       cancel_url: `${process.env.CLIENT_URL}/success`,
//     });
//     return res.status(200).json({ url: session.url });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({ message: error.message });
//   }
// });

// module.exports = paymentRoute;
