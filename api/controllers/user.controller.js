import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/User.model.js";

export const test = (req, res) => {
    res.json("Hello World");
};

export const updateUser = async (req, res, next) => {
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateduser = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    avatar: req.body.avatar,
                },
            },
            { new: true }
        );

        const { password, ...rest } = updateduser._doc;

        res.status(200).json(rest);
    } catch (err) {
        next(errorHandler(500, err.message));
    }
};
