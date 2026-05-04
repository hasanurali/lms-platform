import mongoose from "mongoose";
import ApiError from "./apiError.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";

const validateObjectId = (id) => {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            MESSAGES.GENERAL.VALIDATION_ERROR
        );
    }
};


export default validateObjectId;