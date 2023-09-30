const express = require("express");
const autController = require("./../controller/authController");
const userController = require("./../controller/userController");

const userRouter = express.Router();

userRouter.route("/signUp").post(autController.signUp);
userRouter.route("/logIn").post(autController.logIn);
userRouter.route("/forgetPassword").post(autController.forgetPassword);
userRouter.route("/resetPassword/:token").post(autController.resetPassword);

userRouter.use(autController.protect);

userRouter.route("/password").patch(autController.changeMyPassword);
userRouter
  .route("/")
  .delete(userController.deleteMyAccount)
  .patch(userController.updateMe);

userRouter.use(autController.isUserAllowedToAccess("admin"));

userRouter.route("/").get(userController.getAllUsers);
userRouter
  .route("/:id")
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
