import { Course } from "./course.schema.js";
import { Lecture } from "./lecture.schema.js";
import { User } from "../user/user.schema.js";
import { Payment } from "./payment.schema.js";

import { instance } from "../../../config/razorpayConfig.js";

import crypto from "crypto";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    return res.status(200).json({
      courses,
    });
  } catch (err) {
    console.error("error in getAllCourses controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    return res.status(200).json({
      course,
    });
  } catch (err) {
    console.error("error in getSingleCourse controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    
    const courses = await Course.find({_id: {
      $in: req.user.subscription
    }});

    console.log(courses);
    return res.status(200).json({
      courses,
    });
    
  } catch (err) {
    console.error("error in getMyCourses controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const fetchLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ course: req.params.id });

    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
      return res.status(200).json({ lectures });
    }

    if (!user.subscription.includes(req.params.id))
      return res.status(400).json({
        message: "You have not subscribed to this course",
      });

    return res.status(200).json({ lectures });
  } catch (err) {
    console.error("error in fetchLectures controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const fetchLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
      return res.status(200).json({ lecture });
    }

    if (!user.subscription.includes(lecture.course))
      return res.status(400).json({
        message: "You have not subscribed to this course",
      });

    return res.status(200).json({ lecture });
  } catch (err) {
    console.error("error in fetchLecture controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const checkout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.params.id);

    if (user.subscription.includes(course._id)) {
      return res.status(400).json({
        message: "You have already enrolled this course",
      });
    }

    const options = {
      amount: Number(course.price * 100),
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    return res.status(201).json({
      order,
      course,
    });
  } catch (err) {
    console.error("error in checkout controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    const isAuthentic = signature === razorpay_signature;

    if (isAuthentic) {
      const newPayment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      await newPayment.save();

      const user = await User.findById(req.user._id);

      const course = await Course.findById(req.params.id);

      user.subscription.push(course._id);

      await user.save();

      return res.status(200).json({
        message: "Course Purchased Successfully",
      });
    } else {
      return res.status(400).json({
        message: "Payment Failed",
      });
    }
  } catch (err) {
    console.error("error in paymentVerification controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};
