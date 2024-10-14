import {Router} from "express";
import {
  getAllCourses,
  getSingleCourse,
  fetchLectures,
  fetchLecture,
  getMyCourses,
  checkout,
  paymentVerification,
} from "./course.controllers.js"
import { isAuth } from "../../../middlewares/isAuth.js"

const router = Router();

router.get("/mycourse", isAuth, getMyCourses);
router.get("/all", getAllCourses);
router.get("/:id", getSingleCourse);
router.get("/lectures/:id", isAuth, fetchLectures);
router.get("/lecture/:id", isAuth, fetchLecture);
router.post("/checkout/:id", isAuth, checkout);
router.post("/verification/:id", isAuth, paymentVerification);


export default router;
