const express = require("express");
const auth = require("./../controller/authController");
const orderController = require("./../controller/orderController");

const orderRouter = express.Router();

orderRouter.use(auth.protect);

orderRouter
  .route("/checkout/:productId")
  .get(orderController.getCheckoutSession);

module.exports = orderRouter;
