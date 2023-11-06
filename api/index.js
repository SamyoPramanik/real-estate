import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRoute from "./routes/listing.route.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();

console.log(process.env.MONGO);

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => console.log(err));

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRoute);

app.get("/api/avatars/:filename", (req, res) => {
    const __dirname = path.resolve(path.dirname(""));
    res.sendFile(__dirname + "/api/uploads/" + req.params.filename);
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
