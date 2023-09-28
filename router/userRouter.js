const express = require("express");
const autController = require("./../controller/authController");

const userRouter = express.Router();

userRouter.route("/signUp").post(autController.signUp);
userRouter.route("/logIn").post(autController.logIn);
userRouter.route("/forgetPassword").post(autController.forgetPassword);

module.exports = userRouter;
