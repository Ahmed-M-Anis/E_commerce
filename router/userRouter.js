const express = require("express");
const autController = require("./../controller/authController");

const userRouter = express.Router();

userRouter.route("/signUp").post(autController.signUp);

module.exports = userRouter;
