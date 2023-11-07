import express from "express";

import {
    createListing,
    deleteListing,
    getListing,
    updateListing,
    getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const listingRoute = express.Router();

listingRoute.post("/create", verifyToken, createListing);
listingRoute.delete("/delete/:id", verifyToken, deleteListing);
listingRoute.post("/update/:id", verifyToken, updateListing);
listingRoute.get("/get/:id", getListing);
listingRoute.get("/get", getListings);

export default listingRoute;
