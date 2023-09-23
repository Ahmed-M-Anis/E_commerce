const express = require("express");
const autController = require("./../controller/authController");

const userRouter = express.Router();

userRouter.route("/signUp").post(autController.signUp);
userRouter.route("/logIn").post(autController.logIn);

module.exports = userRouter;
