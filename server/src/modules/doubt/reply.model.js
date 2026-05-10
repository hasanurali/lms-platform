import mongoose from 'mongoose'

const replySchema = new mongoose.Schema({
    doubt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doubt",
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true
    }

}, { timestamps: true });

// Add index for faster query
replySchema.index({ doubt: 1, createdAt: 1 });

export default mongoose.model('Reply', replySchema);