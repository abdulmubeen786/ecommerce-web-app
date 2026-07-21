const express = require("express");
const uploadRoute = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// multer setup using memory storage

const storage = multer.memoryStorage();
const upload = multer({ storage });

uploadRoute.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).json({ message: "no file uploaded" });
    }

    // function to handle stream upload to cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const strem = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        // use streamifire to convert file buffer to stream
        streamifier.createReadStream(fileBuffer).pipe(strem);
      });
    };

    const result = await streamUpload(req.file.buffer);
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = uploadRoute;
