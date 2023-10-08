const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
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
    required: [true, "review must have user"],
  },
  orderdAt: {
    type: Date,
    default: Date.now(),
  },
  address: {
    type: String,
    required: [true, "you must have address"],
  },
  phone: String,
  state: {
    type: String,
    enum: ["ordered", "delevrying", "delevered"],
    default: "ordered",
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name phone address email" }).populate({
    path: "products.product",
    select: "name image price quantity",
  });
  next();
});

orderSchema.virtual("totalPrice").get(function () {
  let totalPrice = 0;
  // Iterate through the products and calculate the total price
  for (const item of this.products) {
    totalPrice += item.product.price * item.quantity;
  }
  console.log(totalPrice);
  return totalPrice;
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
