const express = require("express");
const Product = require("./../models/productModel.js");
const productcontroller = require("./../controller/productController.js");

const productRouter = express.Router();

productRouter
  .route("/")
  .post(productcontroller.createPorduct)
  .get(productcontroller.getAllPorduct);

productRouter
  .route("/:id")
  .patch(productcontroller.updateProduct)
  .delete(productcontroller.deleteProduct)
  .get(productcontroller.getOnePorduct);

productRouter.get("/search/:searchKey", productcontroller.searchProduct);

module.exports = productRouter;
