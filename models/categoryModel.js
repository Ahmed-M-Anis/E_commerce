const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "category must have name"],
    unique: true,
    maxLength: [32, "name must be less than 32 character"],
  },
  image: {
    type: String,
    maxLength: 150,
    default: "not found",
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
