import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { nanoid } from "nanoid";
import User from "../models/user.js";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError, sendEmail, createVerifyEmail } from "../helpers/index.js";
import fs from "fs/promises";
import gravatar from "gravatar";
import Jimp from "jimp";

// перевіряємо чи є наша секретна строка
// console.log(process.env.JWT_SECRET)

const { JWT_SECRET } = process.env;

const avatarPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email, password } = req.body;
  const avatarURL = gravatar.url(email);
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = createVerifyEmail({ email, verificationToken });

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = createVerifyEmail({
    email,
    verificationToken: user.verifyToken,
  });

  await sendEmail(verifyEmail);
  res.json({
    message: "Verification email sent",
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const updateUserSubscription = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const avatarUpdate = async (req, res) => {
  const { _id } = req.user;
  // console.log(req.body); з'явиться текстова частина
  // console.log(req.file); інформація про файл
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);

  const avatar = await Jimp.read(oldPath);
  avatar.resize(250, 250);
  avatar.write(oldPath);

  // fs.rename переміщує файл з temp в public/avatars, в newPath вказано новий шлях, включаючи ім'я
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({
    avatarURL,
  });
};

export default {
  signup: ctrlWrapper(signup),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateUserSubscription: ctrlWrapper(updateUserSubscription),
  avatarUpdate: ctrlWrapper(avatarUpdate),
};
