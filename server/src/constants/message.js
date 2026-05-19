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
        TOKEN_REFRESHED: "Token refreshed successfully",
        EMAIL_VERIFIED: 'Email verified successfully',
        INVALID_OTP: "Invalid OTP",
        EMAIL_NOT_VERIFY: "Please verify your email to login"
    }),

    // User
    USER: Object.freeze({
        NOT_FOUND: 'User not found',
        FETCHED: 'User fetched successfully',
        FETCHED_ALL: 'Users fetched successfully',
        UPDATE: 'Profile updated successfully',
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
        THUMBNAIL_REQUIRED: "Thumbnail is required"
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
        UNAUTHORIZED: 'You are not allowed to modify this lesson',
        VIDEO_REQUIRED: "Video is required",
        NOT_IN_COURSE: "This lesson does not belong to the specified course",
        CORRUPTED: "Lesson data is corrupted"
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
        SOMETHING_WENT_WRONG: "Something went wrong"
    }),

    // Progress
    PROGRESS: Object.freeze({
        FETCHED: 'Progress fetched successfully',
        UPDATED: 'Progress updated successfully',
        COMPLETED: 'Course completed successfully',
    }),

    // Doubt
    DOUBT: Object.freeze({
        CREATED: "Doubt created successfully",
        FETCHED: "Doubt fetched successfully",
        FETCHED_ALL: "Doubts fetched successfully",
        REPLY_ADDED: "Reply added successfully",
        MARKED_AS_ANSWERED: "Doubt marked as answered successfully",
        CLOSED: "Doubt closed successfully",
        NOT_FOUND: "Doubt not found",
        ALREADY_CLOSED: "This doubt is already closed",
        ALREADY_ANSWERED: "This doubt is already answered",
        CANNOT_REPLY_TO_CLOSED: "Cannot reply to a closed doubt",
        UNAUTHORIZED: "You are not authorized to access this doubt",
        NOT_ENROLLED: "You must enroll in this course to ask a doubt",
        ONLY_OWNER_CAN_CLOSE: "Only the student who created this doubt can close it",
        ONLY_INSTRUCTOR_CAN_ANSWER: "Only the course instructor or admin can mark this doubt as answered"
    }),

    // Review
    REVIEW: Object.freeze({
        CREATED: "Review created successfully",
        UPDATED: "Review updated successfully",
        DELETED: "Review deleted successfully",
        FETCHED_ALL: "Reviews fetched successfully",
        NOT_FOUND: "Review not found",
        ALREADY_EXISTS: "You have already reviewed this course",
        NOT_ENROLLED: "You must be enrolled in this course to submit a review",
        UNAUTHORIZED: "You are not authorized to modify this review",
        CANNOT_REVIEW_OWN: "Instructor cannot review their own course"
    }),

    // Notification
    NOTIFICATION: Object.freeze({
        FETCHED_ALL: "Notifications fetched successfully",
        NOT_FOUND: "Notification not found",
        MARKED_AS_READ: "Notification marked as read successfully",
        ALL_MARKED_AS_READ: "All notifications marked as read successfully",
        UNAUTHORIZED: "You are not authorized to modify this notification"
    })

});

export default MESSAGES;