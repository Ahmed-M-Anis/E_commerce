const Category = require("./../models/categoryModel");
const Product = require("./../models/productModel");
const factory = require("./factoryHandler.js");
const catchAsync = require("./../feature/catchError");

exports.createCategory = factory.createDoc(Category);
exports.getAllCategory = factory.findAllDoc(Category);
exports.getOneCategory = factory.findOneDoc(Category);
exports.updateCategory = factory.updateDoc(Category);
exports.uploadCategoryPhoto = factory.uploadImage();
exports.resizeCategoryPhoto = factory.resizeImage(
  "public/images/category",
  "product"
);

exports.deleteCategory = factory.deleteDocAndIsRef(Product, [Category]);
