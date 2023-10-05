const Order = require("./../models/orderModel");
const factory = require("./factoryHandler");
const catchAsync = require("./../feature/catchError");
const AppError = require("./../feature/appError");

exports.prepareOrderData = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

exports.createOrder = factory.createDoc(Order);
exports.getAllOrder = factory.findAllDoc(Order);
exports.getOneOrder = factory.findOneDoc(Order);
exports.updateOrder = factory.updateDoc(Order);
exports.deleteOrder = factory.deleteDoc(Order);

exports.getAllOrderForUser = catchAsync(async (req, res, next) => {
  const curOrder = await Order.find({ user: req.user._id });

  res.status(200).json({
    status: "seccess",
    result: curOrder.length,
    data: {
      data: curOrder,
    },
  });
});
