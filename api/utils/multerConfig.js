import multer from "multer";
import { errorHandler } from "./error.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./api/uploads");
    },
    filename: function (req, file, cb) {
        const newFilename = new Date().getTime() + "-" + file.originalname;
        cb(null, newFilename);
    },
});

const uploder = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
            cb(null, true);
        } else {
            req.error = "file is not image";
            cb(null, false);
        }
    },
});

export default uploder;
