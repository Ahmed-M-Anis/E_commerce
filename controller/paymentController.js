const stripe = require("stripe")(
  "sk_test_51NxTRvGrqLma2Oio5gNML79jBZ5lwIXDtwy30vYSVIJB94R2kX8VFs3faJe31pmMPJQ9vWE3LmiMEGXa97d1AFvP00A8bQdBjI"
);
const Product = require("../models/productModel.js");
const catchAsync = require("../feature/catchError.js");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked product
  const Myproduct = await Product.findById(req.params.productId);

  const YOUR_DOMAIN = "http://localhost:3000";

  const product = await stripe.products.create({
    name: Myproduct.name,
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Myproduct.price * 100,
    currency: "usd",
  });

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: price.id,
        quantity: req.body.quantity,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/public/success.html`,
    cancel_url: `${YOUR_DOMAIN}/public/cancel.html`,
  });

  res.status(200).json({
    status: "success",
    session,
  });
});
