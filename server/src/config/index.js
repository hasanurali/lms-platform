import "dotenv/config"
import JWT_CONFIG from "./jwt.config.js"
import COOKIE_CONFIGURATION from "./cookie.config.js";

// Validate required env
const required = ["MONGO_URI", "JWT_REFRESH_KEY", "JWT_ACCESS_KEY"];
required.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required env variable: ${key}`);
    }
});

export const config = Object.freeze({

    env: process.env.NODE_ENV || 'production',

    port: parseInt(process.env.PORT, 10) || 2000,

    mongoUri: process.env.MONGO_URI,

    bcryptRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,

    jwt: JWT_CONFIG,

    cookie: COOKIE_CONFIGURATION

});