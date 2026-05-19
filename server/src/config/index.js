import "dotenv/config"
import JWT_CONFIG from "./jwt.config.js"
import COOKIE_CONFIGURATION from "./cookie.config.js";
import { cloudinary } from "./cloudinary.config.js";
import corsOptions from "./cors.config.js";
import transporter from "./email.config.js"

// Validate required env
const required = [
    "MONGO_URI",
    "JWT_ACCESS_KEY",
    "JWT_REFRESH_KEY",
    "JWT_ACCESS_EXPIRY",
    "JWT_REFRESH_EXPIRY",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "CLIENT_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REFRESH_TOKEN",
    "GOOGLE_USER"
];

required.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required env variable: ${key}`);
    }
});

if (process.env.JWT_ACCESS_KEY.length < 32) {
    throw new Error("JWT_ACCESS_KEY too weak");
};

if (process.env.JWT_REFRESH_KEY.length < 32) {
    throw new Error("JWT_REFRESH_KEY too weak");
};

export const config = Object.freeze({

    env: process.env.NODE_ENV || 'production',

    port: parseInt(process.env.PORT, 10) || 2000,

    mongoUri: process.env.MONGO_URI,

    bcryptRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,

    jwt: JWT_CONFIG,

    cookie: COOKIE_CONFIGURATION,

    cloudinary,

    corsOptions,

    clientUrl: process.env.CLIENT_URL,

    transporter
});