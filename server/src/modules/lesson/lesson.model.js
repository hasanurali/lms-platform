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
    video: {
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            default: null
        },
        hash: {
            type: String,
            default: null
        }
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

// Remove sansitive field from response
lessonSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.video?.publicId;
    delete obj.video?.hash;
    return obj;
};

export default mongoose.model('Lesson', lessonSchema);