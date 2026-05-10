import mongoSanitize from "express-mongo-sanitize";

const mongoSanitizeMiddleware = (req, res, next) => {

    req.body = mongoSanitize.sanitize(req.body || {});
    req.params = mongoSanitize.sanitize(req.params || {});

    req.cleanQuery = mongoSanitize.sanitize({ ...(req.query || {}) });

    next();
};

export default mongoSanitizeMiddleware;