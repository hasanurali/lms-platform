# Auth API Documentation

## Overview
The Auth API handles user registration, email verification, login, logout, and access token refresh. Registration creates an account and sends a 6-digit OTP to the user's email. Tokens are issued only after email verification is complete.

---

## Base URL
```
http://localhost:2000/api/v1
```

Or in production:
```
https://your-domain.com/api/v1
```

**Current API Version:** v1

---

## Cookies

Endpoints that issue tokens set the following cookies automatically:

| Cookie | Description |
|--------|-------------|
| `accessToken` | Short-lived token used to authenticate requests |
| `refreshToken` | Long-lived token used to issue new access tokens |

Cookies are cleared on logout.

---

## Rate Limiting

The following endpoints are rate limited to prevent abuse:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/verify-email`
- `POST /auth/resend-otp` **(NEW)**
- `POST /auth/refresh`

---

## Registration Flow

1. `POST /auth/register` — creates the account and sends a 6-digit OTP to the provided email. No tokens are issued yet.
2. `POST /auth/verify-email` — verifies the OTP, marks the account as verified, and issues both tokens as cookies.

---

## Endpoints

### 1. Register
**Endpoint:** `POST /auth/register`

**Authentication:** Not required

**Description:** Creates a new unverified user account and sends a 6-digit OTP to the provided email address. Tokens are not issued at this stage — the user must verify their email first via `POST /auth/verify-email`.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "password": "string (required)",
  "role": "string (optional, default: student — student | instructor)"
}
```

**Success Response:**
- **Status:** `201 Created`
- **Message:** `Account created successfully`
- **Response:**
```json
{
  "message": "Account created successfully",
  "data": {
    "_id": "ObjectId",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "",
    "profilePicture": "https://api.dicebear.com/9.x/identicon/svg?seed=...",
    "role": "student",
    "isVerified": false
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Name is required` | `name` is missing or empty |
| `400 Bad Request` | `Name must be 3-30 characters` | `name` length out of range |
| `400 Bad Request` | `Name must contain only letters` | `name` contains non-letter characters |
| `400 Bad Request` | `Email is required` | `email` is missing or empty |
| `400 Bad Request` | `Invalid email format` | `email` is not a valid email address |
| `400 Bad Request` | `Password is required` | `password` is missing or empty |
| `400 Bad Request` | `Password must be at least 8 characters` | `password` is too short |
| `400 Bad Request` | `Must contain at least one uppercase letter` | `password` missing uppercase |
| `400 Bad Request` | `Must contain at least one lowercase letter` | `password` missing lowercase |
| `400 Bad Request` | `Must contain at least one number` | `password` missing digit |
| `400 Bad Request` | `Must contain at least one special character` | `password` missing `@$!%*?&` |
| `400 Bad Request` | `role must be student or instructor` | `role` is not a valid value |
| `409 Conflict` | `Email already registered` | An account with this email already exists |

---

### 2. Verify Email
**Endpoint:** `POST /auth/verify-email`

**Authentication:** Not required

**Description:** Verifies the user's email using the 6-digit OTP sent during registration. On success, the account is marked as verified, both tokens are set as cookies, and a welcome notification is sent. The OTP expires after 10 minutes and is deleted after use.

**Request Body:**
```json
{
  "email": "string (required)",
  "otp": "string (required, 6 digits)"
}
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Email verified successfully`
- **Cookies set:** `accessToken`, `refreshToken`
- **Notification sent:** A welcome system notification is sent to the user.
- **Response:**
```json
{
  "message": "Email verified successfully",
  "data": {
    "_id": "ObjectId",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "",
    "profilePicture": "https://api.dicebear.com/9.x/identicon/svg?seed=...",
    "role": "student",
    "isVerified": true
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Email is required` | `email` is missing or empty |
| `400 Bad Request` | `OTP is required` | `otp` is missing or empty |
| `400 Bad Request` | `OTP must be 6 digits` | `otp` is not exactly 6 characters |
| `400 Bad Request` | `OTP must be numbers only` | `otp` contains non-numeric characters |
| `400 Bad Request` | `Verification session expired. Please login again.` | Email not found or user already verified |
| `400 Bad Request` | `Invalid OTP` | OTP does not match or has expired |

---

### 3. Resend OTP
**Endpoint:** `POST /auth/resend-otp`

**Authentication:** Not required

**Description:** Sends a new 6-digit OTP to the unverified user's email. The previous OTP is invalidated and replaced. Use this endpoint if the user did not receive the original OTP or it has expired. No validation middleware is applied beyond rate limiting.

**Request Body:**
```json
{
  "email": "string (required)"
}
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `A new OTP has been sent to your email address.`
- **Response:**
```json
{
  "message": "A new OTP has been sent to your email address."
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Email is required` | `email` is missing or empty |
| `400 Bad Request` | `Verification session expired. Please login again.` | Email not found or user is already verified |

---

### 4. Login
**Endpoint:** `POST /auth/login`

**Authentication:** Not required

**Description:** Authenticates a verified user with email and password. If the account exists but is not verified, a new OTP is sent to the email and an error is returned. Returns the user and sets both tokens as cookies on success.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Logged in successfully`
- **Cookies set:** `accessToken`, `refreshToken`
- **Response:**
```json
{
  "message": "Logged in successfully",
  "data": {
    "_id": "ObjectId",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "",
    "profilePicture": "https://api.dicebear.com/9.x/identicon/svg?seed=...",
    "role": "student",
    "isVerified": true
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Invalid email` | `email` is not a valid email format |
| `400 Bad Request` | `Password is required` | `password` is missing or empty |
| `401 Unauthorized` | `Invalid email or password` | No user found with this email, or password does not match |
| `401 Unauthorized` | `Please verify your email to login` | Account exists but email is not verified — a new OTP has been sent |

---

### 5. Logout
**Endpoint:** `POST /auth/logout`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Description:** Logs out the authenticated user by clearing the refresh token from the database and removing both cookies.

**Request Body:** None

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Logged out successfully`
- **Cookies cleared:** `accessToken`, `refreshToken`
- **Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `401 Unauthorized` | `You are not authorized` | No token provided, user not found, or user is not verified |
| `401 Unauthorized` | `Session expired, please login again` | Access token has expired — use `/auth/refresh` first |
| `401 Unauthorized` | `You are not authorized` | Token is malformed or signature is invalid |

---

### 6. Refresh Token
**Endpoint:** `POST /auth/refresh`

**Authentication:** Not required (reads `refreshToken` cookie directly)

**Description:** Issues a new `accessToken` and `refreshToken` pair using the current refresh token cookie. The old refresh token is invalidated and replaced.

**Request Body:** None

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Token refreshed successfully`
- **Cookies set:** `accessToken`, `refreshToken`
- **Response:**
```json
{
  "message": "Token refreshed successfully"
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `401 Unauthorized` | `Session expired, please login again` | No refresh token cookie provided, or token has expired |
| `401 Unauthorized` | `You are not authorized` | Token is malformed, user not found, not verified, or token does not match stored hash |
