const express = require("express");
const cartRouter = express.Router();
const Cart = require("../model/Cart");
const Product = require("../model/product");
const productRouter = require("./productRouter");
const user = require("../model/user");
const { protect } = require("../middleware/authmiddleware");

// // helper function to get a cart by user id or guest id
const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

// // @router post /api/cart
// // @desc Add a product to the cart for a guest or logged in User
// // @access public

cartRouter.post("/cart", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "product not found" });

    // determine if the user is logged in or guest
    let cart = await getCart(userId, guestId);

    // if the cart exist, update it
    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color,
      );
      if (productIndex > -1) {
        // if the product already exist update the quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // add new product
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0],
          price: product.price,
          size,
          color,
          quantity,
        });
      }
      //   recalculate the total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      // create a new cart for guest or user
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0],
            price: product.price,
            color,
            size,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
});
//  update product quantity in the cart for guest and logged user
// access public

cartRouter.put("/cart", async (req, res) => {
  const { productId, color, size, quantity, userId, guestId } = req.body;
  try {
    const cart = await getCart(userId, guestId);

    if (!cart) return res.status(404).json({ message: "cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.color === color &&
        p.size === size,
    );

    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1); // ye method jb kaam krega jb value 0 ho jaye gi to khud hi item remove ho jayee
      }
      // update total price
      cart.totalPrice = cart.products.reduce(
        (accu, item) => accu + item.price * item.quantity,
        0,
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "product nor found" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
    console.log(error);
  }
});

// @delete product from cart

cartRouter.delete("/cart", async (req, res) => {
  const { productId, size, color, quantity, userId, guestId } = req.body;
  try {
    const cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "cart not found" });
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color,
    );
    if (productIndex > -1) {
      cart.products.splice(productId, 1);

      cart.totalPrice = cart.products.reduce(
        (accu, item) => accu + item.price * item.quantity,
        0,
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "product not found" });
    }
  } catch (error) {
    res.status(200).json({ message: "server error" });
    console.log(error);
  }
});

// get cart detail
cartRouter.get("/cart", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);

    if (cart) {
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

// merge cart
cartRouter.post("/cart/merge", protect, async (req, res) => {
  const { guestId } = req.body;
  try {
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res.status(404).json({ message: "guest cart empty" });
      }

      if (userCart) {
        // merge guestcart into user
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color,
          );
          if (productIndex > -1) {
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            userCart.products.push(guestItem);
          }
        });
        userCart.totalPrice = userCart.products.reduce(
          (accu, item) => accu + item.price * item.quantity,
          0,
        );
        await userCart.save();
        try {
          await Cart.findOneAndDelete({ guestId });
        } catch (error) {
          console.error("deleting guest id error", error);
        }
        res.status(200).json(userCart);
      } else {
        // user hai no cart merge guest cart into user
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;

        await guestCart.save();
        res.status(200).json(guestCart);
      }
    } else {
      if (userCart) {
        return res.status(200).json(userCart);
      }
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "server error" });
  }
});

module.exports = cartRouter;
