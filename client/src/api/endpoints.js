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
    },
    REVIEW: {
        CREATE: (id) => `/courses/${id}/reviews`,
        FETCH: (id) => `/courses/${id}/reviews`,
        UPDATE: (id) => `/reviews/${id}`,
        DELETE: (id) => `/reviews/${id}`
    },
    LESSON: {
        CREATE: (id) => `/modules/${id}/lessons`,
        FETCHALL: (id) => `/modules/${id}/lessons`,
        FETCH: (id) => `lessons/${id}`,
        UPDATE: (id) => `lessons/${id}`,
        DELETE: (id) => `lessons/${id}`
    },
    PROGRESS: {
        FETCH: (courseId) => `/progress/${courseId}`,
        MARKCOMPLETE: `/progress/complete-lesson`,
        LASTLESSON: `/progress/last-lesson`
    }
};