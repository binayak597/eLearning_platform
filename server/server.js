import dotenv from  "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


import { connectToDB } from "./config/connectToDB.js";


import authRouter from "./src/features/user/user.routes.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());



//api gateways

//requests related to user
//http://localhost:8080/api/user
app.use("/api/user", authRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    connectToDB();
    console.log(`server is running on port ${PORT}`);
});