const express = require("express");
const productRouter = require("./router/productRouter.js");

const app = express();

app.use(express.json());

app.use("/api/v1/product", productRouter);

module.exports = app;
