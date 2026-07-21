const express = require("express");
const adminRoute = express.Router();
const User = require("../model/user");
const { protect, admin } = require("../middleware/authmiddleware");

// add user by admin
adminRoute.post("/admin/user", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(404).json({ message: "email already exist" });
    }
    let newuser = await new User({
      name: name,
      email: email,
      password: password,
      role: role || "customer",
    }).save();
    res.status(201).json(newuser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

// get all users by admin
adminRoute.get("/admin/allusers", protect, admin, async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

// update user by admin

adminRoute.put("/admin/:id", protect, admin, async (req, res) => {
  const { name, email, role, password } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.password = password || user.password;
      user.role = role || user.role;

      await user.save();
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

// delete user by admin

adminRoute.delete("/admin/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      return res.status(200).json({ message: "user delete successfully" });
    } else {
      return res.status(500).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = adminRoute;
