const jwt = require("jsonwebtoken");
const catchAsync = require("./../feature/catchError");
const User = require("./../models/userModel");
const config = require("./../config");
const AppError = require("./../feature/appError");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECURE, {
    expiresIn: config.tokenExpriresIn,
  });
};

const sendTokn = (user, res, statusCode) => {
  let cookieOptions = {
    expires: new Date(Date.now() + config.tokenExpriresIn), // 40 day
    httpOnly: true,
  };
  if (process.env.STAGE === "production") cookieOptions.secure = true;

  const token = createToken(user._id);
  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token: token,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  sendTokn(newUser, res, 201);
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { password, email } = req.body;
  console.log(password, email);
  if (!password || !email)
    next(
      new AppError("please provid the email and the password to log in", 400)
    );
  const curUser = await User.findOne({ email }).select("+password");
  console.log(curUser);

  if ((!curUser, !(await curUser.checkPassword(password, curUser.password))))
    next(new AppError("the email or the passowd not exist", 404));

  sendTokn(curUser, res, 200);
});
