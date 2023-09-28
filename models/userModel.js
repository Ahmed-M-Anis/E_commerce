const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const config = require("./../config.js");

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
  resetTokenExpires: Date,
});

// hashing the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  this.passwordChangedAt = Date.now();
  next();
});

userSchema.methods.isPasswordChanged = function (JWTTimestamp) {
  if (!this.passwordChangedAt) return false;

  const changedTimestamp = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10
  );

  return JWTTimestamp < changedTimestamp;
};

/**
 *
 * @param {string} unHashedPassword
 * @param {string} hashedPassword
 * @returns {boolean}
 */
userSchema.methods.checkPassword = async function (
  unHashedPassword,
  hashedPassword
) {
  return await bcrypt.compare(unHashedPassword, hashedPassword);
};

userSchema.methods.createResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.resetTokenExpires = Date.now() + config.resetTokenExpires;

  return token;
};

const User = mongoose.model("user", userSchema);
module.exports = User;
