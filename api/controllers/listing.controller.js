import Listing from "../models/Listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        let data = { ...req.body, userRef: req.user.id };
        console.log(req.body);
        console.log(data);
        const listing = await Listing.create(data);
        return res.status(200).json(listing);
    } catch (err) {
        next(errorHandler(err.statusCode, err.message));
    }
};

export const deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, "Listing not found"));
        }

        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing deleted successfully");
    } catch (err) {
        next(errorHandler(500, err.message));
    }
};
