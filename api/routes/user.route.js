import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { showFilename, update_avatar } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const userRouter = express.Router();

userRouter.get("/test", test);
userRouter.post("/update-avatar", verifyToken, update_avatar, showFilename);

userRouter.post("/update", verifyToken, updateUser);

export default userRouter;
