const express = require("express");
const auth = require("./../controller/authController");
const payment = require("../controller/paymentController");
const orderController = require("./../controller/orderController");

const orderRouter = express.Router({ mergeParams: true });

orderRouter.use(auth.protect);

orderRouter.route("/checkout").post(payment.getCheckoutSession);

orderRouter.route("/allOrders").get(orderController.getAllOrder);
orderRouter
  .route("/")
  .post(orderController.createOrder)
  .get(orderController.getAllOrderForUser);

orderRouter
  .route("/:id")
  .get(orderController.getOneOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

orderRouter.post("/orderCart", orderController.createOrderCart);

module.exports = orderRouter;
