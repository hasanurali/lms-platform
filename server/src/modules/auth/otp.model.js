import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 10 * 60 * 1000),
        },
    },
    { timestamps: true }
);

// Add index for faster query
otpSchema.index({ email: 1, otp: 1 })

// Add TTL for auto delete after 10 minute
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Otp", otpSchema);
