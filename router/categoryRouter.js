const express = require("express");
const autController = require("./../controller/authController");
const categoryController = require("./../controller/categoryController");

const categoryRouter = express.Router();

categoryRouter.route("/").post(categoryController.createCategory);

categoryRouter.route("/:id").delete(categoryController.deleteCategory);

module.exports = categoryRouter;
