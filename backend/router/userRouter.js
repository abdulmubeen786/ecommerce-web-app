const express = require("express");
const proApp = express.Router();
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authmiddleware");
const validate = require("../middleware/validate");
const { loginSchema, signupSchema } = require("../middleware/userValidator");

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const generteAccessToken = (user) => {
  return jwt.sign(
    { user: { id: user._id, role: user.role } },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );
};

const generteRefreshToken = (user) => {
  return jwt.sign(
    { user: { id: user._id, role: user.role } },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
};

// register user
proApp.post("/user/register", validate(signupSchema), async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "email Already Exist" });
    }

    user = new User({ name, email, password });

    const accessToken = generteAccessToken(user);
    const refreshToken = generteRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return res
      .status(201)
      .json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
});

// login user
proApp.post("/user/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const matchpass = await user.matchPassword(password);
    if (!matchpass) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const accessToken = generteAccessToken(user);
    const refreshToken = generteRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return res
      .status(200)
      .json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
});

// refresh token
proApp.post("/user/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ message: "refreshToken not found" });
  }
  try {
    const decode = await jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );
    const user = await User.findById(decode.user.id);

    if (!user || user.refreshToken !== refreshToken) {
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
      return res
        .status(400)
        .json({ message: "refresh token invalid please login again" });
    }

    const accessToken = generteAccessToken(user);
    const freshToken = generteRefreshToken(user);
    user.refreshToken = freshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });
    res.cookie("refreshToken", freshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
    return res.status(200).json({ message: "token refreshed successfully" });
  } catch (error) {
    console.log(error);
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.status(500).json({ message: "refresh token error" });
  }
});

proApp.get("/user/profile", protect, async (req, res) => {
  return res.send(req.user);
});

proApp.post("/user/logout", protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      refreshToken: null,
    });
    await user.save();
    res.clearCookie("accessToke");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "successfully log out" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "internal server error" });
  }
});

module.exports = proApp;
