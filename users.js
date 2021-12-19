const express = require("express");
const mongoose = require("mongoose");
const HttpError = require("./error");

const router = express.Router();
const Schema = mongoose.Schema;

const { Encrypt, Decrypt } = require("./encryption");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = new mongoose.model("User", userSchema);

router.post("/signup", async (req, res, next) => {
  const { name, email, password } = req.body;

  const encryptedPassword = Encrypt(password);

  const newUser = new User({ name, email, password: encryptedPassword });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError("Error creating a new user", 500);
    return next(error);
  }

  res
    .status(200)
    .json({
      message: `Hi ${name}, your account was successfully created.`,
      user: newUser.toObject({ getters: true }),
    });
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Error finding the user", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "No user exists with the provided email ID",
      404
    );
    return next(error);
  }

  let decryptedPassword = Decrypt(existingUser.password);

  if (decryptedPassword != password) {
    const error = new HttpError("Invalid credentials", 500);
    return next(error);
  }

  res
    .status(200)
    .json({
      message: `Hi ${existingUser.name}, your have successfully logged in.`,
      user: existingUser.toObject({ getters: true }),
    });
});

router.get("/users", async (req, res, next) => {
  let users;

  try {
    users = await User.find();
  } catch (err) {
    const error = new HttpError("Could not fetch other users", 500);
    return next(error);
  }

  if (!users) {
    const error = new HttpError("Could not find other users", 404);
    return next(error);
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
});

module.exports = router;
