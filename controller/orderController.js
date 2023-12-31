const Order = require("./../models/orderModel");
const factory = require("./factoryHandler");
const catchAsync = require("./../feature/catchError");
const Cart = require("./../models/cartModel");
const productController = require("./productController");
const AppError = require("./../feature/appError");

exports.getAllOrder = factory.findAllDoc(Order);
exports.getOneOrder = factory.findOneDoc(Order);
exports.updateOrder = factory.updateDoc(Order);
exports.deleteOrder = factory.deleteDoc(Order);

exports.createOrder = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.products)
    req.body.products = [
      {
        product: req.params.productId,
        quantity: req.body.quantity,
      },
    ];

  const curOrder = await Order.create(req.body);

  await productController.decreaseTheStock(curOrder.products);

  res.status(201).json({
    status: "success",
    data: {
      data: curOrder,
    },
  });
});

exports.getAllOrderForUser = catchAsync(async (req, res, next) => {
  const curOrder = await Order.find({ user: req.user._id });

  res.status(200).json({
    status: "seccess",
    result: curOrder.length,
    data: {
      data: curOrder,
      totalPrice: curOrder.totalPrice,
    },
  });
});

exports.createOrderCart = catchAsync(async (req, res, next) => {
  const curCart = await Cart.findOne({ user: req.user._id });
  if (!curCart) next(new AppError("user don't have cart", 400));

  req.body.user = req.user._id;
  req.body.products = curCart.products;

  const curOrder = await Order.create(req.body);

  await productController.decreaseTheStock(curOrder.products);
  res.status(200).json({
    status: "seccess",
    data: {
      data: curOrder,
    },
  });
});
