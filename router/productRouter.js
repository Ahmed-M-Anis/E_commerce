const express = require("express");
const productcontroller = require("./../controller/productController.js");
const auth = require("./../controller/authController.js");

const productRouter = express.Router({ mergeParams: true });

productRouter
  .route("/")
  .post(productcontroller.createPorduct)
  .get(
    auth.protect,
    auth.isUserAllowedToAccess("user"),
    productcontroller.getAllPorduct
  );

productRouter
  .route("/:id")
  .patch(productcontroller.updateProduct)
  .delete(productcontroller.deleteProduct)
  .get(productcontroller.getOnePorduct);

productRouter.get("/search/:searchKey", productcontroller.searchProduct);

module.exports = productRouter;
