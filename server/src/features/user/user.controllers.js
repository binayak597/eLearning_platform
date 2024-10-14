import { User } from "./user.schema.js";
import {Progress} from "../course/progress.schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../../../utils/sendEmail.js";
import sendForgotMail from "../../../utils/sendForgotEmail.js";
import { Lecture } from "../course/lecture.schema.js";

export const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    let user = await User.findOne({ email });

    if (user)
      return res.status(400).json({
        message: "User Already exists",
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = {
      name,
      email,
      password: hashedPassword,
    };

    const otp = Math.floor(Math.random() * 1000000);

    const activationToken = jwt.sign(
      {
        user,
        otp,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );

    const userData = {
      name,
      otp,
    };

    await sendEmail(email, "E learning", userData);

    return res.status(200).json({
      message: "Otp send to your mail",
      activationToken,
    });
  } catch (err) {
    console.error("error in register controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { otp, activationToken } = req.body;

    const payload = jwt.verify(activationToken, process.env.JWT_SECRET);

    if (!payload)
      return res.status(400).json({
        message: "Otp Expired",
      });

    if (payload.otp !== Number(otp))
      return res.status(400).json({
        message: "Wrong Otp",
      });

    await User.create({
      name: payload.user.name,
      email: payload.user.email,
      password: payload.user.password,
    });

    return res.json({
      message: "User Registered",
    });
  } catch (err) {
    console.error("error in verifyUser controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        message: "User is not found",
      });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({
        message: "wrong Password",
      });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    return res.json({
      message: `Welcome back ${user.name}`,
      token,
      user,
    });
  } catch (err) {
    console.error("error in loginUser controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "No User found" });
    return res.status(200).json({ user });
  } catch (error) {
    console.error("error in myProfile controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        message: "No User with this email",
      });

    const token = jwt.sign({ email }, process.env.FORGOT_PASSWORD_SECRET);

    const data = { email, token };

    await sendForgotMail("E learning", data);

    user.resetPasswordExpire = Date.now() + 1 * 60 * 1000;

    await user.save();

    return res.status(200).json({
      message: "Reset Password Link is send to you mail",
    });
  } catch (err) {
    console.error("error in forgotPassword controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const decodedData = jwt.verify(req.query.token, process.env.FORGOT_PASSWORD_SECRET);

    const user = await User.findOne({ email: decodedData.email });

    if (!user)
      return res.status(404).json({
        message: "No user with this email",
      });

    if (user.resetPasswordExpire === null)
      return res.status(404).json({
        message: "Token Expired",
      });

    if (user.resetPasswordExpire < Date.now()) {
      return res.status(404).json({
        message: "Token Expired",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashedPassword;

    user.resetPasswordExpire = null;

    await user.save();

    return res.status(200).json({ message: "Password Reset successfully" });

  } catch (err) {
    console.error("error in resetPassword controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};


export const addProgress = async (req, res) => {
  
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.query.courseId,
    });
  
    const { lectureId } = req.query;
  
    if (progress.completedLectures.includes(lectureId)) {
      return res.status(200).json({
        message: "Progress recorded",
      });
    }
  
    progress.completedLectures.push(lectureId);
  
    await progress.save();
  
    return res.status(201).json({
      message: "new Progress added",
    });

  } catch (err) {
    console.error("error in addProgress controller -> ", err.message);
    return res.status(500).json({ message: err.message });
  }
};

export const getYourProgress = async (req, res) => {

  try {
    const progress = await Progress.find({
    user: req.user._id,
    course: req.query.courseId,
  });

  if (!progress) return res.status(404).json({ message: "you haven't started this course lecture yet" });

  const allLectures = (await Lecture.find({ course: req.query.courseId })).length;
  console.log(progress);
  const completedLectures = progress[0]?.completedLectures?.length;

  const courseProgressPercentage = (completedLectures * 100) / allLectures;

  return res.status(200).json({
    courseProgressPercentage,
    completedLectures,
    allLectures,
    progress,
    allLectures
  });
  } catch (err) {
    console.error("error in getYourProgress controller -> ", err.message);
    return res.status(500).json({ message: err.message });
  }
  
};
