const JWT_CONFIG = {
    ACCESS: {
        SECRET: process.env.JWT_ACCESS_KEY,
        EXPIRY: "10m"
    },

    REFRESH: {
        SECRET: process.env.JWT_REFRESH_KEY,
        EXPIRY: "7d"
    }
}

export default JWT_CONFIG;