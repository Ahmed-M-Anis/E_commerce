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
    productcontroller.uploadPorductPhoto,
    productcontroller.resizeProductPhoto,
    productcontroller.createPorduct
  )
  .get(
    auth.protect,
    auth.isUserAllowedToAccess("user"),
    productcontroller.getAllPorduct
  );

productRouter
  .route("/:id")
  .patch(
    auth.protect,
    productcontroller.uploadPorductPhoto,
    productcontroller.resizeProductPhoto,
    productcontroller.updateProduct
  )
  .delete(productcontroller.deleteProduct)
  .get(productcontroller.getOnePorduct);

productRouter.get("/search/:searchKey", productcontroller.searchProduct);

module.exports = productRouter;
