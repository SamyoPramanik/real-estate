import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/User.model.js";
import uploder from "../utils/multerConfig.js";
import Listing from "../models/Listing.model.js";

export const getInfo = async (req, res, next) => {
    try {
        const data = await User.findById(req.user.id);
        const { password, ...user } = data._doc;
        res.status(200).json(user);
    } catch (err) {
        next(errorHandler(500, err.message));
    }
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

export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.clearCookie("access_token");
        res.status(200).json("User has been deleted");
    } catch (err) {
        next(errorHandler(500, err.message));
    }
};

export const updateIamges = async (req, res, next) => {
    try {
        uploder.any()(req, res, async (err) => {
            if (err) {
                console.log(err);
                return next(errorHandler(500, err.message));
            } else {
                return next();
            }
        });
    } catch (err) {
        return next(errorHandler(500, err.message));
    }
};

export const showFilenames = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            filename: req.files[0].filename,
        });
    } catch (err) {
        next(errorHandler(500, err.message));
    }
};

export const getUserListings = async (req, res, next) => {
    try {
        const listings = await Listing.find({ userRef: req.user.id });
        res.status(200).json(listings);
    } catch (err) {
        next(errorHandler(500, err.message));
    }
};

export const getUser = async (req, res, next) => {
    try {
        const data = await User.findById(req.params.id);
        if (!data) return next(errorHandler(404, "User not found"));
        const { password, ...user } = data._doc;
        res.status(200).json(user);
    } catch (err) {
        next(errorHandler(500, err.message));
    }
};
