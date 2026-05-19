import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from '../../config/index.js'
import { ROLES } from '../../constants/index.js'
import crypto from "crypto"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 8
    },
    bio: {
        type: String,
        default: ""
    },
    profilePicture: {
        url: {
            type: String,
            default: function () {
                return `https://api.dicebear.com/9.x/identicon/svg?seed=${this._id || this.email}`;
            }
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
    role: {
        type: String,
        default: ROLES.STUDENT,
        enum: [ROLES.STUDENT, ROLES.INSTRUCTOR, ROLES.ADMIN]
    },
    refreshToken: {
        type: String,
        default: null,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


// Hash Password
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(config.bcryptRounds);
    this.password = await bcrypt.hash(this.password, salt);

});

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
    const token = jwt.sign({ id: this._id }, config.jwt.REFRESH.SECRET, { expiresIn: config.jwt.REFRESH.EXPIRY });
    return token;
};

// Generate access token
userSchema.methods.generateAccessToken = function () {
    const token = jwt.sign({ id: this._id }, config.jwt.ACCESS.SECRET, { expiresIn: config.jwt.ACCESS.EXPIRY });
    return token;
};

// Hash token
userSchema.methods.hashToken = function (token) {
    return crypto.createHash("sha256").update(token).digest("hex");
};

// Set hashed refresh token in db
userSchema.methods.setRefreshToken = function (token) {
    this.refreshToken = crypto.createHash("sha256").update(token).digest("hex");
};

// Compare hashed refresh token
userSchema.methods.compareRefreshToken = function (token) {
    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    return this.refreshToken === hashed;
};

// Compare hashed password
userSchema.methods.comparePassword = async function (password) {
    const comparePassword = await bcrypt.compare(password, this.password);
    return comparePassword;
};

// Remove sansitive field from response
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshToken;

    if (obj.profilePicture) {
        delete obj.profilePicture.publicId;
        delete obj.profilePicture.hash;
    };

    return obj;
};


export default mongoose.model('User', userSchema);