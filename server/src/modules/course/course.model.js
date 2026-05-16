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
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        },
        hash: {
            type: String,
            required: true
        }
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    averageRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    ratingDistribution: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 }
    }
}, { timestamps: true });

// Add index for faster query
courseSchema.index({ instructor: 1 });
courseSchema.index({ isPublished: 1, createdAt: -1 });

// Remove sansitive field from response
courseSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.thumbnail?.publicId;
    delete obj.thumbnail?.hash;
    return obj;
};

export default mongoose.model('Course', courseSchema);