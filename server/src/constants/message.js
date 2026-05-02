const MESSAGES = Object.freeze({
    // Auth
    AUTH: Object.freeze({
        LOGIN_SUCCESS: 'Logged in successfully',
        LOGOUT_SUCCESS: 'Logged out successfully',
        REGISTER_SUCCESS: 'Account created successfully',
        INVALID_CREDENTIALS: 'Invalid email or password',
        UNAUTHORIZED: 'You are not authorized',
        TOKEN_EXPIRED: 'Session expired, please login again',
        EMAIL_EXISTS: 'Email already registered',
    }),

    // User
    USER: Object.freeze({
        NOT_FOUND: 'User not found',
    }),

    // General 
    GENERAL: Object.freeze({
        VALIDATION_ERROR: 'Validation failed',
    }),
});

export default MESSAGES;