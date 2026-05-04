import mongoose from "mongoose"

const moduleSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    order: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Add index for faster query
moduleSchema.index({ course: 1, order: 1 }, { unique: true });

export default mongoose.model("Module", moduleSchema);