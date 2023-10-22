const express = require("express");
const autController = require("./../controller/authController");
const categoryController = require("./../controller/categoryController");
const productRouter = require("./productRouter");

const categoryRouter = express.Router();
categoryRouter.use("/:categoryId/product", productRouter);

categoryRouter
  .route("/")
  .post(
    autController.protect,
    autController.isUserAllowedToAccess("admin"),
    categoryController.uploadCategoryPhoto,
    categoryController.resizeCategoryPhoto,
    categoryController.createCategory
  )
  .get(categoryController.getAllCategory);

categoryRouter
  .route("/:id")
  .delete(
    autController.protect,
    autController.isUserAllowedToAccess("admin"),
    categoryController.deleteCategory
  )
  .get(categoryController.getOneCategory)
  .patch(
    autController.protect,
    autController.isUserAllowedToAccess("admin"),
    categoryController.uploadCategoryPhoto,
    categoryController.resizeCategoryPhoto,
    categoryController.updateCategory
  );

module.exports = categoryRouter;
