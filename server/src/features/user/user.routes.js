import {Router} from "express";
import {
  loginUser,
  myProfile,
  register,
  verifyUser,
} from "./user.controllers.js";
import { isAuth } from "../../../middlewares/isAuth.js";


const router = Router();

router.post("/register", register);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.get("/me", isAuth, myProfile);

export default router;
