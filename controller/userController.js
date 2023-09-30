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

  if (!curUser.checkPassword(req.body.password, curUser.password))
    next(new AppError("worng password ,try again", 400));
  await User.updateOne({ _id: req.user._id }, { isActive: false });

  res.status(204).json({
    status: "success",
    data: {
      data: null,
    },
  });
});
