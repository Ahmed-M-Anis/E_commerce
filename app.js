const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const productRouter = require("./router/productRouter.js");
const userRouter = require("./router/userRouter.js");
const categoryRouter = require("./router/categoryRouter.js");
const orderRouter = require("./router/orderRouter.js");
const cartRouter = require("./router/cartRouter.js");
const sendingEorror = require("./controller/errorController.js");
const config = require("./config.js");

const app = express();

//http secury
app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: config.requistLimit,
  message: "too many request please try again after an hour",
});

// limit the number of requist for one ip
app.use(limiter);

app.use(express.json());

//data Sanitize protiction form data query injection
app.use(mongoSanitize());

//data Sanitize protiction form xss
app.use(xss());

app.use(express.static("public"));
app.use("/images/product", express.static("product"));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/cart", cartRouter);

app.all("*", (req, res, next) => next(new AppError("this URL not found", 404)));

app.use(sendingEorror);

module.exports = app;
