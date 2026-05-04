import mongoose from 'mongoose'

const lessonSchema = new mongoose.Schema({
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: null
    },
    order: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Add index for faster query
lessonSchema.index({ module: 1, order: 1 }, { unique: true });

export default mongoose.model('Lesson', lessonSchema);