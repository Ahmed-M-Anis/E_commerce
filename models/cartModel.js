const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "cart must have user"],
    unique: true,
  },
});

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "products.product",
    select: "name price description image inStock",
  });
  next();
});

cartSchema.virtual("totalPrice").get(function () {
  let totalPrice = 0;
  // Iterate through the products and calculate the total price
  for (const item of this.products) {
    totalPrice += item.product.price * item.quantity;
  }
  return totalPrice;
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
