const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DBCONNECTION);
    console.log("Mongodb successfully connected");
  } catch (err) {
    console.error("err", err);
    process.exit(1);
  }
};

module.exports = dbConnection;
