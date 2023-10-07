const Cart = require("./../models/cartModel");
const factory = require("./factoryHandler");
const catchAsync = require("./../feature/catchError");
const AppError = require("./../feature/appError");

exports.prepareCartData = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

exports.addToCart = catchAsync(async (req, res, next) => {
  let curCart = await Cart.findOne({ user: req.user._id });
  if (!curCart) curCart = await Cart.create({ user: req.user._id });

  curCart.products.push({
    product: req.params.productId,
    quantity: req.body.quantity,
  });
  await curCart.save();

  res.status(200).json({
    status: "success",
    data: curCart,
  });
});

exports.getMyCart = catchAsync(async (req, res, next) => {
  const curCart = await Cart.findOne({ user: req.user._id });

  res.status(200).json({
    status: "seccess",
    data: curCart,
    totalPrice: curCart.totalPrice,
  });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  const curCart = await Cart.findOne({ user: req.user._id });
  const newCart = curCart.products.filter((product) => {
    return product.product._id.toString() !== req.params.productId;
  });

  curCart.products = newCart;
  curCart.save();

  res.status(204).json({
    status: "seccess",
    data: curCart,
    totalPrice: curCart.totalPrice,
  });
});

exports.UpdateCart = catchAsync(async (req, res, next) => {
  const curCart = await Cart.findOne({ user: req.user._id });

  curCart.products.forEach((product) => {
    if (product.product._id.toString() !== req.params.productId)
      product.quantity = req.body.quantity;
  });
  await curCart.save();

  res.status(200).json({
    status: "seccess",
    data: curCart,
    totalPrice: curCart.totalPrice,
  });
});
