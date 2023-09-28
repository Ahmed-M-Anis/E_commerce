const jwt = require("jsonwebtoken");
const catchAsync = require("./../feature/catchError");
const User = require("./../models/userModel");
const config = require("./../config");
const AppError = require("./../feature/appError");
const Email = require("./../feature/email.js");

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
  if (!password || !email)
    next(
      new AppError("please provid the email and the password to log in", 400)
    );
  const curUser = await User.findOne({ email }).select("+password");

  if ((!curUser, !(await curUser.checkPassword(password, curUser.password))))
    next(new AppError("the email or the passowd not exist", 404));

  sendTokn(curUser, res, 200);
});

const getTokenFromUser = (req, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  } else next(new AppError("your not logIn ,please log in", 401));
};

exports.protect = catchAsync(async (req, res, next) => {
  //check if there is a token
  const token = getTokenFromUser(req, next);

  // check if token is modified
  const verifiedToken = await jwt.verify(token, process.env.TOKEN_SECURE);

  // check if the account not deleted
  const curUser = await User.findOne({ _id: verifiedToken.id });
  if (!curUser) next(new AppError("this user is not exist", 401));

  // check if user change his password
  if (curUser.isPasswordChanged(verifiedToken.iat))
    next(
      new AppError("user have change his password , please login again", 401)
    );

  req.user = curUser;
  next();
});

exports.isUserAllowedToAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      next(
        new AppError("you don't have premonitions to preform this action", 405)
      );
    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const curUser = await User.findOne({ email: req.body.email });

  if (!curUser)
    next(new AppError("there is no account with this email adress", 404));

  const resetToken = curUser.createResetToken();
  await curUser.save({ validateBeforeSave: false });

  try {
    const url = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/resetPassword/${resetToken}`;

    new Email(curUser, url).sendResetPassword();

    res.status(200).json({
      status: "success",
      data: {
        data: "email is sended",
      },
    });
  } catch (err) {
    curUser.passwordResetToken = undefined;
    curUser.resetTokenExpires = undefined;
    await curUser.save();
    next(new AppError("fiald to send email please try again later", 500));
  }
});

//if(!curUser.checkPassword(req.body.password , curUser.password)) next(new AppError("wrong password"))
