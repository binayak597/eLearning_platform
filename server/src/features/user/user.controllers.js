import { User } from "./user.schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../../../utils/sendEmail.js";

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
