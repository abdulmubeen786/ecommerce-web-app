const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnection = require("./config/db");
const productRouter = require("./router/productRouter");
const userRouter = require("./router/userRouter");
const cartRouter = require("./router/cartRouter");
const checkoutRouter = require("./router/checkoutRouter");
const paymentRoute = require("./router/paymentRouter");
const orderRoute = require("./router/orderRouter");
const webhookRouter = require("./router/webhookRouter");
const adminProducts = require("./router/adminProductRoute");
const adminOrderRoute = require("./router/adminOrderRouter");
const adminRoute = require("./router/adminRouter");
const uploadRoute = require("./router/uploadRoutes");
const subscribeRoutes = require("./router/subscribeRouter");

const CLIENT_URL = process.env.CLIENT_URL;

app.use("/api", webhookRouter);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

// user Routes
app.use("/api", userRouter);
app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/api", checkoutRouter);
app.use("/api", orderRoute);
app.use("/api", paymentRoute);
app.use("/api", adminProducts);
app.use("/api", adminOrderRoute);
app.use("/api", adminRoute);
app.use("/api", uploadRoute);
app.use("/api", subscribeRoutes);

const PORT = process.env.PORT || 5000;

// Local development mein hi listen karo, Vercel serverless mein nahi
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}

dbConnection();

module.exports = app;
