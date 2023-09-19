const AppError = require("./../feature/appError");

const sendingErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendingErrorProductin = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);

    res.status(500).json({
      status: "error",
      message: "someting went wrong :(",
    });
  }
};

const handelIdErrorDB = (err) => {
  const message = `invalid ${err.path} of value ${err.value}`;

  return new AppError(message, 400);
};

const handeDblicateErrorDB = (err) => {
  const key = err.message.match(/{([^}]+)}/g);
  const message = `there are anther one with ${key} pls change it`;

  return new AppError(message, 400);
};

const handelValidationError = (err) => {
  const value = Object.values(err.errors).map((err) => err.message);

  const message = `invalid input data ${value.join("  .")}`;
  return new AppError(message, 400);
};

const handeljwtError = () =>
  new AppError("token has been changed, please log in again", 401);

const handeljwtExpiredError = () =>
  new AppError("your login is expired, please log in again", 401);

const sendingEorror = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.STAGE === "dev") {
    sendingErrorDev(err, res);
  } else if (process.env.STAGE === "production") {
    let error = err;
    if (error.name === "CastError") error = handelIdErrorDB(error);
    if (error.code === 11000) error = handeDblicateErrorDB(error);
    if (error.name === "ValidationError") error = handelValidationError(error);
    if (error.name === "JsonWebTokenError") error = handeljwtError();
    if (error.name === "TokenExpiredError") error = handeljwtExpiredError();

    sendingErrorProductin(error, res);
  }
};

module.exports = sendingEorror;
