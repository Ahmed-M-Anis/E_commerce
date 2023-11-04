const stripe = require("stripe")(
  "sk_test_51NxTRvGrqLma2Oio5gNML79jBZ5lwIXDtwy30vYSVIJB94R2kX8VFs3faJe31pmMPJQ9vWE3LmiMEGXa97d1AFvP00A8bQdBjI"
);
const Product = require("../models/productModel.js");
const catchAsync = require("../feature/catchError.js");
const AppError = require("./../feature/appError");
const Cart = require("../models/cartModel.js");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked product
  const Myproduct = await Product.findById(req.params.productId);
  console.log(Myproduct.price[0].finalPrice);

  if (Myproduct.inStock < req.body.quantity || Myproduct.inStock === 0)
    return next(new AppError("there is no items in stock", 404));

  const YOUR_DOMAIN = "https://e-commerce-l194.onrender.com";

  const product = await stripe.products.create({
    name: Myproduct.name,
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Myproduct.price[0].finalPrice * 100,
    currency: "usd",
  });

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: price.id,
        quantity: req.body.quantity || 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/public/success.html`,
    cancel_url: `${YOUR_DOMAIN}/public/cancel.html`,
  });

  res.status(200).json({
    status: "success",
    session: session.url,
  });
});

exports.getCheckoutSessionCart = catchAsync(async (req, res, next) => {
  const MyCart = await Cart.findOne({ user: req.user._id });

  const line_items_promises = MyCart.products.map(async (CurProduct) => {
    if (
      CurProduct.product.inStock < CurProduct.quantity ||
      CurProduct.product.inStock === 0
    )
      return next(new AppError("there is no items in stock", 404));

    const product = await stripe.products.create({
      name: CurProduct.product.name,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: CurProduct.product.price[0].finalPrice * 100,
      currency: "usd",
    });

    return {
      price: price.id,
      quantity: CurProduct.quantity,
    };
  });

  const line_items = await Promise.all(line_items_promises);

  const YOUR_DOMAIN = "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/public/success.html`,
    cancel_url: `${YOUR_DOMAIN}/public/cancel.html`,
  });

  res.status(200).json({
    status: "success",
    session,
  });
});
