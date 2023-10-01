const Category = require("./../models/categoryModel");
const Product = require("./../models/productModel");
const factory = require("./factoryHandler.js");
const catchAsync = require("./../feature/catchError");
const APIfeatures = require("./../feature/APIFeature");

exports.createCategory = factory.createDoc(Category);
exports.getAllCategory = factory.findAllDoc(Category);
exports.getOneCategory = factory.findOneDoc(Category);
exports.updateCategory = factory.updateDoc(Category);

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const productsToUpdate = await Product.find({ category: req.params.id });

  const promises = productsToUpdate.map((product) => {
    product.category = undefined;
  });

  await Promise.all(promises);

  await Category.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: { data: "category have ben deleted" },
  });
});
