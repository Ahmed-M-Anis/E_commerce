const factory = require("./factoryHandler.js");
const catchAsync = require("./../feature/catchError");
const AppError = require("./../feature/appError");
const Review = require("./../models/reviewModel.js");
const User = require("./../models/userModel.js");
const Product = require("../models/productModel.js");

exports.prepareData = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

/* exports.isHeOwnerOfReview = catchAsync(async (req, res, next) => {
  const curReview = await Review.findById(req.params.id);
  if (!curReview) return next(new AppError("this review is not exist", 404));
  console.log(curReview.user._id == req.user._id);
  if (curReview.user._id !== req.user._id)
    return next(new AppError("you can't change anther review", 404));
  next();
}); */

exports.createReview = factory.createDoc(Review);
exports.getAllReview = factory.findAllDoc(Review);
exports.getOneReview = factory.findOneDoc(Review);
exports.updateReview = factory.updateDoc(Review);
exports.deleteReview = factory.deleteDoc(Review);
