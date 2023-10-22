const express = require("express");
const auth = require("./../controller/authController");
const reviewController = require("./../controller/reviewController");

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .route("/")
  .post(
    auth.protect,
    reviewController.prepareData,
    reviewController.createReview
  )
  .get(reviewController.getAllReview);

reviewRouter
  .route("/:id")
  .get(reviewController.getOneReview)
  .patch(auth.protect, reviewController.updateReview)
  .delete(auth.protect, reviewController.deleteReview);

module.exports = reviewRouter;
