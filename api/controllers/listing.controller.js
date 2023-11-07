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

export const updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, "Listing not found"));
        }

        if (req.user.id != listing.userRef)
            return next(errorHandler(401, "You cannot update this listing"));

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedListing);
    } catch (err) {
        next(errorHandler(500, err.message));
    }
};

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, "Listing not found"));
        }
        res.status(200).json(listing);
    } catch (err) {
        next(errorHandler(500, err.message));
    }
};

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const start = parseInt(req.query.start) || 0;

        let offer = req.query.offer;
        if (offer === "false" || offer === undefined) {
            offer = { $in: [true, false] };
        }

        let parking = req.query.parking;
        if (parking === "false" || parking === undefined) {
            parking = { $in: [true, false] };
        }

        let furnished = req.query.furnished;
        if (furnished === "false" || furnished === undefined) {
            furnished = { $in: [true, false] };
        }

        let type = req.query.type;
        if (type === undefined || type === "all") {
            type = { $in: ["sale", "rent"] };
        }

        const searchTerm = req.query.searchTerm || "";
        const sort = req.query.sort || "createdAt";
        const order = req.query.order || "desc";

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: "i" },
            offer,
            parking,
            furnished,
            type,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(start);

        res.status(200).json(listings);
    } catch (err) {
        next(errorHandler(500, err.message));
    }
};
