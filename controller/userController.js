const factory = require("./../controller/factoryHandler");
const User = require("./../models/userModel");
const catchAsync = require("./../feature/catchError");
const AppError = require("./../feature/appError");

exports.getAllUsers = factory.findAllDoc(User);
exports.getOneUser = factory.findOneDoc(User);
exports.updateUser = factory.updateDoc(User);
exports.deleteUser = factory.deleteDoc(User);

exports.deleteMyAccount = catchAsync(async (req, res, next) => {
  const curUser = await User.findOne({ _id: req.user._id }).select("+password");

  if (!(await curUser.checkPassword(req.body.password, curUser.password)))
    next(new AppError("worng password ,try again", 400));
  await User.updateOne({ _id: req.user._id }, { isActive: false });

  res.status(204).json({
    status: "success",
    data: {
      data: null,
    },
  });
});

const fillterBody = (body) => {
  const fillter = ["email", "name"];
  let filteredBody = {};
  fillter.forEach((el) => {
    if (body[el]) filteredBody[el] = body[el];
  });
  return filteredBody;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  const curUser = await User.findOne({ _id: req.user._id }).select("+password");

  if (!(await curUser.checkPassword(req.body.password, curUser.password)))
    next(new AppError("worng password ,try again", 400));

  await User.updateOne({ _id: req.user._id }, fillterBody(req.body));

  res.status(201).json({
    status: "success",
    data: {
      data: req.body,
    },
  });
});
