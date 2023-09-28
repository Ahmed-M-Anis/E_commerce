const factory = require("./../controller/factoryHandler");
const User = require("./../models/userModel");
const catchAsync = require("./../feature/catchError");
const AppError = require("./../feature/appError");

exports.getAllUsers = factory.findAllDoc(User);
exports.getOneUser = factory.findOneDoc(User);
exports.updateUser = factory.updateDoc(User);
exports.deleteUser = factory.deleteDoc(User);

exports.deleteMyAccount = catchAsync(async (req, res, next) => {
  req.user.isActive = false;
  await req.user.save();

  res.status(204).json({
    status: "success",
  });
});
