const express = require("express");
const subscribeRoutes = express.Router();
const Subscribe = require("../model/subscriber");

subscribeRoutes.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "email not found" }); // FIX: 404 -> 400 (bad request, not "not found")
  }
  try {
    let subscribe = await Subscribe.findOne({ email });
    if (subscribe) {
      return res.status(400).json({ message: "email already exist" }); // FIX: 404 -> 400, aur typo "exail" -> "email"
    }
    subscribe = await new Subscribe({ email }).save();
    res.status(201).json(subscribe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = subscribeRoutes;
