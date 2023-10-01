const Product = require("./../models/productModel");
const factory = require("./factoryHandler.js");
const catchAsync = require("./../feature/catchError");
const APIfeatures = require("./../feature/APIFeature");

exports.createPorduct = factory.createDoc(Product);
exports.getAllPorduct = factory.findAllDoc(Product);
exports.getOnePorduct = factory.findOneDoc(Product);
exports.deleteProduct = factory.deleteDoc(Product);
exports.updateProduct = factory.updateDoc(Product);

exports.searchProduct = catchAsync(async (req, res, next) => {
  const searchQuery = {
    $or: [
      { name: { $regex: req.params.searchKey } },
      { brand: { $regex: req.params.searchKey } },
      { "category.name": { $regex: req.params.searchKey } },
      { discreption: { $regex: req.params.searchKey } },
    ],
  };

  const feature = new APIfeatures(req.query, Product.find(searchQuery))
    .fillter()
    .sort()
    .fields()
    .pagination();

  const curProducts = await feature.responseqQuery;

  //const curProducts = await Product.find(searchQuery);

  res.status(200).json({
    status: "success",
    result: curProducts.length,
    data: { data: curProducts },
  });
});
