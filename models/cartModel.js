const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "product",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "cart must have user"],
    unique: true,
  },
  totalPricr: Number,
});

cartSchema.statics.getTotal = async function (userId) {
  const stats = await this.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: "$user",
        totalPricr: { $sum: "$product.price" },
      },
    },
  ]);
  console.log(stats);
};

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "product",
    select: "name image price",
  });
  next();
});

cartSchema.post(/^find/, async function (doc) {
  await doc.constructor.getAvrageRating(doc.user);
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
