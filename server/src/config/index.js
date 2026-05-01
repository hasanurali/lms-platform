import "dotenv/config"

// Validate required env
const required = ["MONGO_URI"];
required.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required env variable: ${key}`);
    }
});

export const config = {
    env: process.env.NODE_ENV || 'production',
    port: parseInt(process.env.PORT, 10) || 2000,
    mongoUri: process.env.MONGO_URI
};