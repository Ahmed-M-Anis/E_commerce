const Cart = require("./../models/cartModel");
const factory = require("./factoryHandler");
const catchAsync = require("./../feature/catchError");
const AppError = require("./../feature/appError");

exports.prepareCartData = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

exports.createCart = factory.createDoc(Cart);
exports.getOneCart = factory.findOneDoc(Cart);
exports.deleteCart = factory.deleteDoc(Cart);
