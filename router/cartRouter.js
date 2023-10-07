const express = require("express");
const auth = require("./../controller/authController");
const cartController = require("./../controller/cartController");

const cartRouter = express.Router();

cartRouter.use(auth.protect);

cartRouter
  .route("/:productId")
  .post(cartController.addToCart)
  .delete(cartController.removeFromCart)
  .patch(cartController.UpdateCart);
cartRouter.route("/").get(cartController.getMyCart);

module.exports = cartRouter;
