const stripe = require("stripe")(
  "sk_test_51NxTRvGrqLma2Oio5gNML79jBZ5lwIXDtwy30vYSVIJB94R2kX8VFs3faJe31pmMPJQ9vWE3LmiMEGXa97d1AFvP00A8bQdBjI"
);
const Product = require("./../models/productModel.js");
const catchAsync = require("./../feature/catchError");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const product = await Product.findById(req.params.productId);

  // 2) Create checkout session
  const Intents = await stripe.paymentIntents.create({
    payment_method_types: ["card"],
    amount: product.price * 100,
    currency: "usd",
    description: product.description,
    customer: req.user._id,
  });

  res.status(200).json({
    status: "success",
    session,
  });
});
