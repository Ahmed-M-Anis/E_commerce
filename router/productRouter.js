const express = require("express");
const Product = require("./../models/productModel.js");

const productRouter = express.Router();

productRouter.post("/", async (req, res, next) => {
  const p = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: p,
  });
});

module.exports = productRouter;
