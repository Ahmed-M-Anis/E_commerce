const factory = require("./factoryHandler.js");
const catchAsync = require("./../feature/catchError");
const APIfeatures = require("./../feature/APIFeature");
const Review = require("./../models/reviewModel.js");
const User = require("./../models/userModel.js");

exports.createReview = factory.createDoc(Review);
exports.getAllReview = factory.findAllDoc(Review);
exports.getOneReview = factory.findOneDoc(Review);
exports.updateReview = factory.updateDoc(Review);
exports.deleteReview = factory.deleteDocAndIsRef(User, [Review]);
