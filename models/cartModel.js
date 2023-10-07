const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  product: [
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
  totalPrice: Number,
});

cartSchema.virtual("totalPrice").get(function () {
  let totalPrice = 0;
  // Iterate through the products and calculate the total price
  for (const item of this.product) {
    totalPrice += item.product.price * item.quantity;
  }
  return totalPrice;
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
