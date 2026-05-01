import { validationResult } from "express-validator"
import apiError from "../utils/apiError.js"
import { HTTP_STATUS, MESSAGES } from "../constants/index.js"


const validate = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new apiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.GENERAL.VALIDATION_ERROR, errors.array());
    };

    next()
}

export default validate;