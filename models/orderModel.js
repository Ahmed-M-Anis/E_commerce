const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  product: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      required: [true, "order must have product"],
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
    path: "product",
    select: "name image price",
  });
  next();
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
