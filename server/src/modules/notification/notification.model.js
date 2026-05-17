import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: [
            "course",
            "doubt",
            "review",
            "enrollment",
            "progress",
            "system"
        ]
    },
    isRead: {
        type: Boolean,
        default: false
    },
    metadata: {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        },
        module: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module"
        },
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson"
        },
        doubt: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doubt"
        },
        review: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        },
        enrollment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Enrollment"
        },
    }
}, { timestamps: true });

// Add index for faster query
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });

export default mongoose.model('Notification', notificationSchema);