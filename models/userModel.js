const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "the user must have a name"],
  },
  email: {
    type: String,
    required: [true, "the user must have a email"],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "the user must have a password"],
    minLength: [8, "the password can't be less than 8 character"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "the user must have a passwordConfirm"],
    minLength: [8, "the passwordConfirm can't be less than 8 character"],
    validate: {
      validator: function (passwordConfirm) {
        return this.password === passwordConfirm;
      },
      massage: "password confirm must equal password confirm",
    },
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordResetToken: String,
});

const User = mongoose.model("user", userSchema);
module.exports = User;
