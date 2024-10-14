import {Router} from "express";
import {
  loginUser,
  myProfile,
  register,
  verifyUser,
  forgotPassword,
  resetPassword,
  addProgress,
  getYourProgress
} from "./user.controllers.js";
import { isAuth } from "../../../middlewares/isAuth.js";


const router = Router();

router.post("/register", register);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.get("/me", isAuth, myProfile);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);
router.post("/add-progress", isAuth, addProgress);
router.get("/get-progress", isAuth, getYourProgress);

export default router;
