import mongoose from 'mongoose'
import { DOUBT_STATUS } from '../../constants/index.js'

const doubtSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: DOUBT_STATUS.OPEN,
        enum: [DOUBT_STATUS.OPEN, DOUBT_STATUS.ANSWERED, DOUBT_STATUS.CLOSED]
    },
    lastReplyAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Add index for faster query
doubtSchema.index({ course: 1, lastReplyAt: -1 });
doubtSchema.index({ student: 1, lastReplyAt: -1 });

export default mongoose.model('Doubt', doubtSchema);