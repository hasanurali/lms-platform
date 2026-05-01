const JWT_CONFIG = {
    ACCESS: {
        SECRET: process.env.JWT_ACCESS_KEY,
        EXPIRY: "1h"
    },

    REFRESH: {
        SECRET: process.env.JWT_REFRESH_KEY,
        EXPIRY: "7d"
    }
}

export default JWT_CONFIG;