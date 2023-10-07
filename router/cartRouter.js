const express = require("express");
const auth = require("./../controller/authController");
const cartController = require("./../controller/cartController");
const payment = require("./../controller/paymentController");

const cartRouter = express.Router();

cartRouter.use(auth.protect);

cartRouter
  .route("/:productId")
  .post(cartController.addToCart)
  .delete(cartController.removeFromCart)
  .patch(cartController.UpdateCart);
cartRouter.route("/").get(cartController.getMyCart);

cartRouter.get("/create-checkout-session", payment.getCheckoutSessionCart);

module.exports = cartRouter;
