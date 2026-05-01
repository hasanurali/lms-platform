import "dotenv/config"

export const config = {
    env: process.env.NODE_ENV || 'production',
    port: parseInt(process.env.PORT, 10) || 2000,
};