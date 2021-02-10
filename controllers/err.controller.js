const AppError = require('./../utils/appError');

const handleCastError = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate fields value : ${value}. please enter another value`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () => {
  const message = `Invalid token! Please login again!`;
  return new AppError(message, 401);
}
const handleTokenExpiredError = () => {
  const message = `Your token has expired! Please login again!`;
  return new AppError(message, 401);
}

const handleValidatorError = (err) => {
  const values = Object.values(err.errors).map(err => err.message);
  const message = `Invalid input data : ${values.join(', ')}`;
  return new AppError(message, 400);
}

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

const sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("WRONG ", err);
    res.status(500).json({
      status: "error",
      message: "some thing wrong",
    });
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
  }
  else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = handleCastError(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") err = handleValidatorError(err);
    if (err.name === "JsonWebTokenError") err = handleJsonWebTokenError();
    if (err.name === "TokenExpiredError") err = handleTokenExpiredError();
    sendErrProd(err, res);
  }
}