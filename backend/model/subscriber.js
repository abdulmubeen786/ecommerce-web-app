const mongoose = require("mongoose");

const subscribeUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true, // FIX: "lowerCase" typo se ye option ignore ho raha tha
  },
  createdAt: { type: Date, default: Date.now }, // FIX: Date.now() -> Date.now (reference, har save par naya time)
});

module.exports = mongoose.model("Subscriber", subscribeUserSchema);
