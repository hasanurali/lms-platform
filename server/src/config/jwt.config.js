const JWT_CONFIG = {
    ACCESS: {
        SECRET: process.env.JWT_ACCESS_KEY,
        EXPIRY: process.env.JWT_ACCESS_EXPIRY
    },

    REFRESH: {
        SECRET: process.env.JWT_REFRESH_KEY,
        EXPIRY: process.env.JWT_REFRESH_EXPIRY
    }
}

export default JWT_CONFIG;