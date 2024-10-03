import jwt from "jsonwebtoken";
import { User } from "../src/features/user/user.schema.js"

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token)
      return res.status(401).json({
        message: "No Token - Unauthorized",
      });

    const payloadData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(payloadData.id);

    next();
  } catch (error) {
    res.status(401).json({
      error: error.message
    });
  }
};


