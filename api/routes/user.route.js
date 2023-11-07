import express from "express";
import {
    deleteUser,
    showFilenames,
    updateIamges,
    updateUser,
    getUserListings,
    getInfo,
} from "../controllers/user.controller.js";
import { showFilename, update_avatar } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const userRouter = express.Router();

userRouter.get("/info", verifyToken, getInfo);
userRouter.post("/update-avatar", verifyToken, update_avatar, showFilename);
userRouter.delete("/delete", verifyToken, deleteUser);

userRouter.post("/update", verifyToken, updateUser);
userRouter.post("/uploadImages", verifyToken, updateIamges, showFilenames);
userRouter.get("/listings", verifyToken, getUserListings);

export default userRouter;
