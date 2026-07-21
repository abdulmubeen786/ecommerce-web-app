const express = require("express");
const productRouter = express.Router();
const Product = require("../model/product");
const { protect, admin } = require("../middleware/authmiddleware");

// @route post/api/products
// @desc create a new product
// @access private/admin

productRouter.post("/products", protect, admin, async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimension,
      weight,
      sku,
    } = req.body;
    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimension,
      weight,
      sku,
      user: req.user._id,
    });
    const newproduct = await product.save();
    res.status(201).json(newproduct);
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
});

// @router put/products/:id
// @desc update an existing product id
// @ access private/admin
productRouter.put("/update/:id", protect, admin, async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimension,
      weight,
      sku,
    } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      // update product fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimension = dimension || product.dimension;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;

      const updateproduct = await product.save();
      res.json(updateproduct);
    } else {
      res.status(403).json({ message: "product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

// @delete product
productRouter.delete("/delete/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "product removed successfully" });
    } else {
      res.status(404).json({ message: "product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

// get route /api/proucts/
// desc get all products with with optional query filters
//  access public
productRouter.get("/products", async (req, res) => {
  try {
    const {
      collections,
      sizes,
      colors,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};

    // filter logic
    if (collections && collections.toLocaleLowerCase() !== "all") {
      query.collections = collections;
    }
    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }
    if (material) {
      query.material = { $in: material.split(",") };
    }
    if (brand) {
      query.brand = { $in: brand.split(",") };
    }
    if (sizes) {
      query.sizes = { $in: sizes.split(",") };
    }
    if (colors) {
      query.colors = { $in: colors.split(",") };
    }
    if (gender) {
      query.gender = gender;
    }
    if (maxPrice || minPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // sort logic;

    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }

    // fetch products and apply sorting and limit;
    let products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

// @route GET /best-seller
// retrive the product with highest rating
// access public
productRouter.get("/product/best-seller", async (req, res) => {
  try {
    const bestseller = await Product.findOne().sort({ rating: -1 });
    if (bestseller) {
      res.status(200).json(bestseller);
    } else {
      res.status(404).json({ message: "best seller not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
    console.error(error);
  }
});

// new arrival
productRouter.get("/product/new-arrival", async (req, res) => {
  try {
    const newarrival = await Product.find().sort({ createdAt: -1 }).limit(8);
    if (newarrival.length === 0) {
      res.status(404).json({ message: "new arrivals not found" });
    } else {
    }
    res.status(200).json(newarrival);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "server error" });
  }
});
// router get/api/products/:id;
// get a single product by id;
//  access public

productRouter.get("/productsingle/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

// router get /api/product/similar/:_id;
// @desc retrive similar product base on the current product`s gender and category;
// access public

productRouter.get("/product/similar-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    const similarproducts = await Product.find({
      _id: { $ne: id },
      category: product.category,
      gender: product.gender,
    }).limit(4);
    res.status(200).json(similarproducts);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log(error);
  }
});

module.exports = productRouter;
