import { HTTP_STATUS } from "../constants/index.js"

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(HTTP_STATUS.FORBIDDEN, "Access denied");
        }
        next();
    };
};

export default authorizeRoles;