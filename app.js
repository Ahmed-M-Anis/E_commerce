const express = require("express");
const productRouter = require("./router/productRouter.js");
const sendingEorror = require("./controller/errorController.js");

const app = express();

app.use(express.json());

app.use("/api/v1/product", productRouter);

app.all("*", (req, res, next) => next(new AppError("this URL not found", 404)));

app.use(sendingEorror);

module.exports = app;
