import express from "express";

import {
    createListing,
    deleteListing,
    updateListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import Listing from "../models/Listing.model.js";

const listingRoute = express.Router();

listingRoute.post("/create", verifyToken, createListing);
listingRoute.delete("/delete/:id", verifyToken, deleteListing);
listingRoute.post("/update/:id", verifyToken, updateListing);

export default listingRoute;
