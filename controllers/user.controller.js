const User = require("../models/user.model");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require("./handleFactory");
const apiFeatures = require('../utils/apiFeatures');

module.exports.read = (req, res, next) => {
  req.profile.hashed_password = undefined;
  return res.json(req.profile);
};
module.exports.updateCart = factory.updateCart(User)