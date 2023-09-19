const Product = require("./../models/productModel");
const factory = require("./factoryHandler.js");

exports.createPorduct = factory.createDoc(Product);
exports.getAllPorduct = factory.findAllDoc(Product);
exports.getOnePorduct = factory.findOneDoc(Product);
exports.deleteProduct = factory.deleteDoc(Product);
exports.updateProduct = factory.updateDoc(Product);
