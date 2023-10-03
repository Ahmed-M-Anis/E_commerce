const express = require("express");
const auth = require("./../controller/authController");
const reviewController = require("./../controller/reviewController");

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(auth.protect);

reviewRouter
  .route("/")
  .post(reviewController.prepareData, reviewController.createReview)
  .get(reviewController.getAllReview);

reviewRouter
  .route("/:id")
  .get(reviewController.getOneReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = reviewRouter;
