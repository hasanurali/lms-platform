import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    price: {
        type: Number,
        default: 0
    },
    thumbnail: {
        type: String,
        default: null
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });


export default mongoose.model('Course', courseSchema);