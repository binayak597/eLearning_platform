import { Course } from "../course/course.schema.js";
import { Lecture } from "../course/lecture.schema.js";
import { User } from "../user/user.schema.js";

import { rm } from "fs";
import { promisify } from "util";
import fs from "fs";

const unlinkAsync = promisify(fs.unlink);

export const createCourse = async (req, res) => {
  try {
    const { title, description, category, createdBy, duration, price } =
      req.body;

    const image = req.file;

    await Course.create({
      title,
      description,
      category,
      createdBy,
      image: image?.path,
      duration,
      price,
    });

    return res.status(201).json({
      message: "Course Created Successfully",
    });
  } catch (err) {
    console.error("error in createCourse controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const addLecture = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course)
      return res.status(400).json({
        message: "No Course with this id",
      });

    const { title, description } = req.body;

    const file = req.file;

    const lecture = await Lecture.create({
      title,
      description,
      video: file?.path,
      course: course._id,
    });

    return res.status(201).json({
      message: "Lecture Added",
      lecture,
    });
  } catch (err) {
    console.error("error in addLecture controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    //to delete video file from upload folder
    rm(lecture.video, () => {
      console.log("Video deleted");
    });

    await lecture.deleteOne();

    return res.status(200).json({ message: "Lecture Deleted" });
  } catch (err) {
    console.error("error in deleteLecture controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    const lectures = await Lecture.find({ course: course._id });

    //videos that are present inside upload folder
    await Promise.all(
      lectures.map(async (lecture) => {
        await unlinkAsync(lecture.video);
        console.log("video is deleted");
      })
    );

    //thumbnail of the course image that is present inside upload folder
    rm(course.image, () => {
      console.log("image deleted");
    });

    await Lecture.find({ course: req.params.id }).deleteMany();

    await course.deleteOne();

    await User.updateMany({}, { $pull: { subscription: req.params.id } });

    return res.status(200).json({
      message: "Course Deleted",
    });
  } catch (err) {
    console.error("error in deleteCourse controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const getAllStats = async (req, res) => {
  try {
    const totalCoures = (await Course.find()).length;
    const totalLectures = (await Lecture.find()).length;
    const totalUsers = (await User.find()).length;

    const stats = {
      totalCoures,
      totalLectures,
      totalUsers,
    };

    return res.status(200).json({
      stats,
    });
  } catch (err) {
    console.error("error in getAllStats controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password"
    );

    return res.json({ users });
  } catch (err) {
    console.error("error in getAllUsers controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const updateRole = async (req, res) => {
  
  try {
    const user = await User.findById(req.params.id);
  
    if (user.role === "user") {
      user.role = "admin";
      await user.save();
  
      return res.status(200).json({
        message: "Role updated to admin",
      });
    }
  
    if (user.role === "admin") {
      user.role = "user";
      await user.save();
  
      return res.status(200).json({
        message: "Role updated",
      });
    }
  } catch (err) {
    console.error("error in updateRole controller -> ", err.message);
    return res.status(500).json({ error: err.message });
  }
};
