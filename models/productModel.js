const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product must have a name"],
    },
    price: {
      type: Number,
      required: [true, "product must have a price"],
      min: [0, "you can't have nigative number"],
    },
    discreption: String,
    inStock: {
      type: Number,
      required: [true, "must provid the number of product in stock"],
      min: [0, "you can't have nigative number"],
    },
    image: {
      type: String,
      required: [true, "you must have an image for product"],
    },
    avregeRate: {
      type: Number,
      min: [0, "rate can't be less than 0"],
      max: [5, "rate can't be greater than 5"],
      default: 4.5,
    },
    ratingNumber: Number,
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
    brand: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ name: 1, brand: 1, price: 1, avregeRate: 1 });

const Product = mongoose.model("product", productSchema);

module.exports = Product;
