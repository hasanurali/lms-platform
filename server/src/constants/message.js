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
        FETCHED: 'User fetched successfully',
        FETCHED_ALL: 'Users fetched successfully',
        UPDATE: 'Profile update successfully',
    }),

    // Course
    COURSE: Object.freeze({
        CREATED: 'Course created successfully',
        UPDATED: 'Course updated successfully',
        DELETED: 'Course deleted successfully',
        NOT_FOUND: 'Course not found',
        PUBLISHED: 'Course published successfully',
        NOT_PUBLISHED: 'Course is not published',
        UNAUTHORIZED: 'You are not allowed to modify this course',
        FETCHED: 'Course fetched successfully',
        FETCHED_ALL: 'Courses fetched successfully',
    }),

    // Module
    MODULE: Object.freeze({
        CREATED: "Module created successfully",
        UPDATED: "Module updated successfully",
        DELETED: "Module deleted successfully",
        FETCHED: "Modules fetched successfully",
        NOT_FOUND: "Module not found",
        UNAUTHORIZED: 'You are not allowed to modify this module'
    }),

    // Lesson
    LESSON: Object.freeze({
        CREATED: "Lesson created successfully",
        UPDATED: "Lesson updated successfully",
        DELETED: "Lesson deleted successfully",
        FETCHED: "Lesson fetched successfully",
        FETCHED_ALL: 'Lessons fetched successfully',
        NOT_FOUND: "Lesson not found",
        UNAUTHORIZED: 'You are not allowed to modify this lesson'
    }),

    // Enrollment
    ENROLLMENT: Object.freeze({
        ENROLL_SUCCESS: "Successfully enrolled in the course",
        ALREADY_ENROLLED: "You are already enrolled in this course",
        ENROLLMENT_FETCHED: "Enrolled courses fetched successfully",
        REQUIRED: "You must enroll in this course to access this content"
    }),

    // General 
    GENERAL: Object.freeze({
        VALIDATION_ERROR: 'Validation failed',
    }),

    // Progress
    PROGRESS: Object.freeze({
        FETCHED: 'Progress fetched successfully',
        UPDATED: 'Progress updated successfully',
        COMPLETED: 'Course completed successfully',
    }),

});

export default MESSAGES;