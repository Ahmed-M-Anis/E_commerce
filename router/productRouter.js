const express = require("express");
const productcontroller = require("./../controller/productController.js");
const auth = require("./../controller/authController.js");
const reviewRouter = require("./reviewRouter.js");
const orderRouter = require("./orderRouter.js");

const productRouter = express.Router({ mergeParams: true });

productRouter.use("/:productId/review", reviewRouter);
productRouter.use("/:productId/order", orderRouter);

productRouter
  .route("/")
  .post(
    auth.protect,
    auth.isUserAllowedToAccess("admin"),
    productcontroller.uploadPorductPhoto,
    productcontroller.resizeProductPhoto,
    productcontroller.createPorduct
  )
  .get(productcontroller.getAllPorduct);

productRouter
  .route("/:id")
  .patch(
    auth.protect,
    auth.isUserAllowedToAccess("admin"),
    productcontroller.uploadPorductPhoto,
    productcontroller.resizeProductPhoto,
    productcontroller.updateProduct
  )
  .delete(
    auth.protect,
    auth.isUserAllowedToAccess("admin"),
    productcontroller.deleteProduct
  )
  .get(productcontroller.getOnePorduct);

productRouter.get("/search/:searchKey", productcontroller.searchProduct);

module.exports = productRouter;
