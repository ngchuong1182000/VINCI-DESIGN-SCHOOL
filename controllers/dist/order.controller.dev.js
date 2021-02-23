"use strict";

var Order = require("../models/order.model");

var factory = require("./handleFactory");

module.exports.getAll = factory.getAll(Order);
module.exports.createOne = factory.createOne(Order);
module.exports.getOne = factory.getOne(Order);
module.exports.updateOne = factory.updateOne(Order);
module.exports.deleteOne = factory.deleteOne(Order);