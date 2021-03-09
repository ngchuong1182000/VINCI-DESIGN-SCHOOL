"use strict";

var AppError = require('./../utils/appError');

var handleCastError = function handleCastError(err) {
  var message = "Invalid ".concat(err.path, " : ").concat(err.value);
  return new AppError(message, 400);
};

var handleDuplicateFieldsDB = function handleDuplicateFieldsDB(err) {
  var value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  var message = "Duplicate fields value : ".concat(value, ". please enter another value");
  return new AppError(message, 400);
};

var handleJsonWebTokenError = function handleJsonWebTokenError() {
  var message = "Invalid token! Please login again!";
  return new AppError(message, 401);
};

var handleTokenExpiredError = function handleTokenExpiredError() {
  var message = "Your token has expired! Please login again!";
  return new AppError(message, 401);
};

var handleValidatorError = function handleValidatorError(err) {
  var values = Object.values(err.errors).map(function (err) {
    return err.message;
  });
  var message = "Invalid input data : ".concat(values.join(', '));
  return new AppError(message, 400);
};

var sendErrDev = function sendErrDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

var sendErrProd = function sendErrProd(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error("WRONG ", err);
    res.status(500).json({
      status: "error",
      message: "some thing wrong",
      stack: err
    });
  }
};

module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = handleCastError(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") err = handleValidatorError(err);
    if (err.name === "JsonWebTokenError") err = handleJsonWebTokenError();
    if (err.name === "TokenExpiredError") err = handleTokenExpiredError();
    sendErrProd(err, res);
  }
};