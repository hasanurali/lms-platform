import ms from "ms"
import parseMaxAge from "../utils/parseMaxAge.js"

const COOKIE_CONFIGURATION = {
    ACCESS: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: parseMaxAge(process.env.ACCESS_COOKIE_MAX_AGE, 10 * 60 * 1000)
    },

    REFRESH: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: parseMaxAge(process.env.REFRESH_COOKIE_MAX_AGE, 7 * 24 * 60 * 60 * 1000)
    }
};

export default COOKIE_CONFIGURATION;