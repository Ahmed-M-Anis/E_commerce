const Product = require("./../models/productModel");
const factory = require("./factoryHandler.js");
const catchAsync = require("./../feature/catchError");

exports.createPorduct = factory.createDoc(Product);
exports.getAllPorduct = factory.findAllDoc(Product);
exports.getOnePorduct = factory.findOneDoc(Product);
exports.deleteProduct = factory.deleteDoc(Product);
exports.updateProduct = factory.updateDoc(Product);

exports.searchProduct = catchAsync(async (req, res, next) => {
  //const searchQuery =

  const curProducts = await Product.find({
    $or: [
      { name: { $regex: req.params.searchKey } },
      { brand: { $regex: req.params.searchKey } },
    ],
  });
  res.status(200).json({
    status: "success",
    result: curProducts.length,
    data: { data: curProducts },
  });
});
