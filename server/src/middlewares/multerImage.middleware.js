import multer from "multer";
import path from "path";
import ApiError from "../utils/apiError.js";
import { HTTP_STATUS } from "../constants/index.js";

// Memory storage
const storage = multer.memoryStorage()

// Allowed types
const allowedTypes = /jpeg|jpg|png|webp/;

// File filter
const fileFilter = (req, file, cb) => {

    const isValidMime = allowedTypes.test(file.mimetype);

    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (!isValidMime || !extname) {
        return cb(new ApiError(HTTP_STATUS.BAD_REQUEST, "Only jpg, jpeg, png and webp files are allowed"));
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

export default upload;