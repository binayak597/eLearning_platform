import Razorpay from "razorpay";
import * as dotenv from "dotenv";
dotenv.config();

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});