const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    name: String,
    image: [
      {
        url: { type: String, required: true },
        altText: { type: String },
      },
    ],
    price: Number,
    color: String,
    size: String,
    quantity: { type: Number, default: 1 },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guestId: { type: String },
    products: [cartItemSchema],
    totalPrice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);
