import multer from "multer";
import path from "path";
import ApiError from "../utils/apiError.js";
import { HTTP_STATUS } from "../constants/index.js";

// Memory storage
const storage = multer.memoryStorage();

// Allowed types
const allowedTypes = /mp4|mkv|webm|avi/;

// File filter
const fileFilter = (req, file, cb) => {

    const isValidMime = file.mimetype.startsWith("video/");

    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (!isValidMime || !extname) {
        return cb(new ApiError(HTTP_STATUS.BAD_REQUEST, "Only mp4, mkv, webm and avi files are allowed"));
    }

    cb(null, true);
};

const uploadVideo = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB
    }
});

export default uploadVideo;