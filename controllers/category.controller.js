const Category = require("../models/category.model");
const { errorHandler } = require("../helpers/dbErrorHandler");
const factory = require("./handleFactory");

module.exports.create = factory.createOne(Category);
module.exports.read = factory.getOne(Category);
module.exports.remove = factory.deleteOne(Category);
module.exports.update = factory.updateOne(Category);

module.exports.list = factory.getAll(Category);