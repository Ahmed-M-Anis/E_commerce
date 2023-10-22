const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product must have a name"],
    },
    price: [
      {
        originalPrice: {
          type: Number,
          required: [true, "product must have a price"],
          min: [0, "you can't have nigative number"],
        },
        discount: {
          type: Number,
          default: 0,
          validate: {
            validator: function (discount) {
              return discount < this.originalPrice;
            },
            massage: "discount must be less than originalPrice ",
          },
        },
        finalPrice: {
          type: Number,
        },
      },
    ],
    description: String,
    inStock: {
      type: Number,
      required: [true, "must provid the number of product in stock"],
      min: [0, "you can't have nigative number"],
    },
    image: {
      type: String,
      default: "no-image.png",
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

productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name" });
  next();
});

productSchema.virtual("review", {
  ref: "review",
  foreignField: "product",
  localField: "_id",
});

productSchema.pre("findOne", function (next) {
  this.populate({ path: "review" });
  next();
});

productSchema.pre("save", function (next) {
  this.price[0].finalPrice =
    this.price[0].originalPrice - this.price[0].discount;
  next();
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
