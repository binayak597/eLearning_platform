import dotenv from  "dotenv";
dotenv.config();


//core modules
import path from 'path';

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


import { connectToDB } from "./config/connectToDB.js";


import authRouter from "./src/features/user/user.routes.js";
import courseRouter from "./src/features/course/course.routes.js";
import adminRouter from "./src/features/admin/admin.routes.js";


const __dirname = path.resolve();

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

app.use(express.static(path.join(__dirname, "/client/dist")));


app.use("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

// handling 404 requests
app.use((req, res) => res.send("Api is not found"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    connectToDB();
    console.log(`server is running on port ${PORT}`);
});