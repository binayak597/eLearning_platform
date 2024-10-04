import dotenv from  "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


import { connectToDB } from "./config/connectToDB.js";


import authRouter from "./src/features/user/user.routes.js";
import courseRouter from "./src/features/course/course.routes.js";
import adminRouter from "./src/features/admin/admin.routes.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());



//api gateways

//requests related to user
//http://localhost:8080/api/user
app.use("/api/user", authRouter);


//requests related to course
//http://localhost:8080/api/course
app.use("/api/course", courseRouter);

//requests related to admin
//http://localhost:8080/api/admin
app.use("/api/admin", adminRouter);


app.use("/server/uploads", express.static("server/uploads"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    connectToDB();
    console.log(`server is running on port ${PORT}`);
});