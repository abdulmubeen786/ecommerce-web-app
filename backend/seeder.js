const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./model/product");
const User = require("./model/user");
const Cart = require("./model/Cart");
const products = require("./data/products");

// connect to db
mongoose.connect(process.env.DBCONNECTION);

// function to seed data

const seedData = async () => {
  try {
    // clear existing data;
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // create default admin user
    const createdUser = await User.create({
      name: "Admin user",
      email: "admin@example.com",
      password: "Welcome@1",
      role: "admin",
    });

    // assign the default user id to each product;
    const userID = createdUser._id;
    const sampleproducts = products.map((product) => {
      return { ...product, user: userID };
    });
    await Product.insertMany(sampleproducts);
    console.log("product data seeded successfully");
    process.exit();
  } catch (error) {
    console.log("error data seeded", error);
    process.exit(1);
  }
};

seedData();
