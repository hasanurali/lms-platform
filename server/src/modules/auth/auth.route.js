import express from "express"
const authRoute = express.Router()
import { registerValidation, loginValidation, verifyEmailValidation } from "./auth.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import { register, login, logout, refresh, verifyEmail, resendOtp } from "./auth.controller.js"
import authMiddleware from "../../middlewares/auth.middleware.js"
import { authLimiter } from "../../middlewares/rateLimit.middleware.js"


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User registration, verification, login, logout, and token refresh
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user account
 *     tags: [Auth]
 *     description: >
 *       Creates a new unverified user account and sends a 6-digit OTP to the
 *       provided email. Tokens are NOT issued at this stage — the user must
 *       verify their email first via POST /auth/verify-email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Pass@1234
 *               role:
 *                 type: string
 *                 enum: [student, instructor]
 *                 default: student
 *                 example: student
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64f1a2b3c4d5e6f7a8b9c0d1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     bio:
 *                       type: string
 *                       example: ""
 *                     profilePicture:
 *                       type: string
 *                       example: https://api.dicebear.com/9.x/identicon/svg?seed=abc
 *                     role:
 *                       type: string
 *                       example: student
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Validation error (name / email / password / role)
 *       409:
 *         description: Email already registered
 */
authRoute.post("/register",
    authLimiter,
    registerValidation,
    validate,
    register
);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email with OTP
 *     tags: [Auth]
 *     description: >
 *       Verifies the user's email using the 6-digit OTP sent during registration.
 *       On success, the account is marked as verified, accessToken and refreshToken
 *       are set as cookies, and a welcome notification is sent.
 *       The OTP expires after 10 minutes and is deleted after use.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               otp:
 *                 type: string
 *                 example: "482910"
 *     responses:
 *       200:
 *         description: Email verified successfully — accessToken & refreshToken cookies set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64f1a2b3c4d5e6f7a8b9c0d1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     bio:
 *                       type: string
 *                       example: ""
 *                     profilePicture:
 *                       type: string
 *                       example: https://api.dicebear.com/9.x/identicon/svg?seed=abc
 *                     role:
 *                       type: string
 *                       example: student
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Missing/invalid email or OTP, session expired, or OTP mismatch
 */
authRoute.post("/verify-email",
    authLimiter,
    verifyEmailValidation,
    validate,
    verifyEmail,
);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP to unverified email
 *     tags: [Auth]
 *     description: >
 *       Sends a fresh 6-digit OTP to an unverified user's email.
 *       The previous OTP is invalidated and replaced.
 *       Use this if the original OTP was not received or has expired.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: New OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: A new OTP has been sent to your email address.
 *       400:
 *         description: Email missing, not found, or user already verified
 */
authRoute.post("/resend-otp",
    authLimiter,
    resendOtp
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     description: >
 *       Authenticates a verified user with email and password.
 *       On success, sets accessToken and refreshToken as cookies.
 *       If the account exists but is not verified, a new OTP is sent automatically.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Pass@1234
 *     responses:
 *       200:
 *         description: Logged in successfully — accessToken & refreshToken cookies set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64f1a2b3c4d5e6f7a8b9c0d1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     bio:
 *                       type: string
 *                       example: ""
 *                     profilePicture:
 *                       type: string
 *                       example: https://api.dicebear.com/9.x/identicon/svg?seed=abc
 *                     role:
 *                       type: string
 *                       example: student
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Invalid email format or missing password
 *       401:
 *         description: Invalid credentials or email not verified (new OTP sent)
 */
authRoute.post("/login",
    authLimiter,
    loginValidation,
    validate,
    login
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     description: >
 *       Logs out the authenticated user by clearing the refresh token from the
 *       database and removing both accessToken and refreshToken cookies.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully — cookies cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: Not authorized, session expired, or token invalid
 */
authRoute.post("/logout",
    authMiddleware,
    logout
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     description: >
 *       Issues a new accessToken and refreshToken pair using the current
 *       refreshToken cookie. The old refresh token is invalidated and replaced.
 *     responses:
 *       200:
 *         description: Token refreshed successfully — new cookies set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully
 *       401:
 *         description: Session expired, token missing, malformed, or user not verified
 */
authRoute.post("/refresh",
    authLimiter,
    refresh
);

export default authRoute;