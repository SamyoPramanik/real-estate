import express from "express";

import { createListing } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const listingRoute = express.Router();

listingRoute.post("/create", verifyToken, createListing);

export default listingRoute;
