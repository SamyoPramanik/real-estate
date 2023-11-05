import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
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
