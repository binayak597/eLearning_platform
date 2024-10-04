import { Course } from "./course.schema.js";
import { Lecture } from "./lecture.schema.js";
import { User } from "../user/user.schema.js";

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
    const courses = await Courses.find({ _id: req.user.subscription });

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
