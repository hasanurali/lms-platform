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
        ME: "/users/me",
        FETCH: (id) => `/users/${id}`,
        UPDATE: "/users/me"

    },
    COURSE: {
        CREATE: "/courses",
        FETCH: (page, limit) => (page || limit) ? `/courses?page=${page}&limit=${limit}` : "/courses",
        FETCHMY: (page, limit, published) => (page || limit || published) ? `/courses/my?page=${page}&limit=${limit}&published=${published}` : "/courses/my",
        DETAILS: (id) => `/courses/${id}`,
        FULL: (id) => `/courses/${id}/full`,
        UPDATE: (id) => `/courses/${id}`,
        DELETE: (id) => `/courses/${id}`
    },
    MODULE: {
        CREATE: (id) => `/courses/${id}/modules`,
        FETCH: (id) => `/courses/${id}/modules`,
        UPDATE: (id) => `/modules/${id}`,
        DELETE: (id) => `/modules/${id}`
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
    },
    DOUBT: {
        CREATE: "/doubts",
        FETCHLESSON: (id) => `/lessons/${id}/doubts`,
        FETCHMY: `/doubts/my`,
        FETCHCOURSE: (id, page, limit) => (page || limit) ? `/courses/${id}/doubts?page=${page}&limit=${limit}` : `/courses/${id}/doubts`,
        FETCHDETAILS: (id) => `/doubts/${id}`,
        REPLY: (id) => `/doubts/${id}/replies`,
        MARKANSWER: (id) => `/doubts/${id}/mark-answered`,
        MARKCLOSE: (id) => `/doubts/${id}/close`
    },
    NOTIFICATION: {
        FETCH: (page, limit) => (page || limit) ? `/notifications?page=${page}&limit=${limit}` : "/notifications",
        MARKREAD: (id) => `/notifications/${id}/read`,
        MARKALLREAD: "/notifications/read-all"
    }
};