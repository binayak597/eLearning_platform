import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  addLecture,
  deleteLecture,
  getAllStats,
  getAllUser,
  updateRole
} from "./admin.controllers.js";
import { isAuth } from "../../../middlewares/isAuth.js";
import { isAdmin } from "../../../middlewares/isAdmin.js";
import { uploadFiles } from "../../../middlewares/multer.js";


const router = Router();

router.post("/course/new", isAuth, isAdmin, uploadFiles, createCourse);
router.delete("/course/delete/:id", isAuth, isAdmin, deleteCourse);
router.post("/course/:id", isAuth, isAdmin, uploadFiles, addLecture);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);
router.put("/user/:id", isAuth, isAdmin, updateRole);
router.get("/stats", isAuth, isAdmin, getAllStats);
router.get("/all-users", isAuth, isAdmin, getAllUser);


export default router;
