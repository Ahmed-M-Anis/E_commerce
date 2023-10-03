const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "review must have a rating"],
      min: [0, "review can't be less than 0"],
      max: [5, "review can't be more than 5"],
    },
    comment: {
      type: String,
      maxLength: 200,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "review must have user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      required: [true, "review must have product"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.statics.getAvrageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        ratingNumber: { $sum: 1 },
        avregeRate: { $avg: "$rating" },
      },
    },
  ]);

  if (!stats[0]) {
    await Product.findByIdAndUpdate(productId, {
      ratingNumber: 0,
      avregeRate: 4.5,
    });
  }
  await Product.findByIdAndUpdate(productId, {
    ratingNumber: stats[0].ratingNumber,
    avregeRate: stats[0].avregeRate,
  });
};

reviewSchema.post("save", function () {
  this.constructor.getAvrageRating(this.product);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.getAvrageRating(doc.product);
});

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;
