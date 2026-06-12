export const ENDPOINTS = {
    AUTH: {
        REGISTER: "/auth/register",
        VERIFY_EMAIL: "/auth/verify-email",
        RESEND_OTP: "/auth/resend-otp",
        LOGIN: "/auth/login",
        LOGOUT: "/auth/logout",
        REFRESH: "/auth/refresh"
    },
    USER: {
        ME: "/users/me"
    },
    COURSE: {
        CREATE: "/courses",
        FETCH: (page, limit) => (page || limit) ? `/courses?page=${page}&limit=${limit}` : "/courses",
        FETCHMY: (page, limit) => (page || limit) ? `/courses/my?page=${page}&limit=${limit}` : "/courses/my",
        DETAILS: (id) => `/courses/${id}`,
        FULL: (id) => `/courses/${id}/full`,
        UPDATE: (id) => `/courses/${id}`,
        DELETE: (id) => `/courses/${id}`
    },
    ENROLLMENT: {
        ENROLL: (id) => `/courses/${id}/enroll`,
        FETCHCOURSES: "/enrollments/my"
    }
};