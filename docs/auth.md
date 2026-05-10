# Auth API Documentation

## Overview
The Auth API handles user registration, login, logout, and access token refresh. On successful authentication, both an `accessToken` and a `refreshToken` are issued as HTTP-only cookies.

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

All auth endpoints that issue tokens set the following cookies automatically:

| Cookie | Description |
|--------|-------------|
| `accessToken` | Short-lived token used to authenticate requests |
| `refreshToken` | Long-lived token used to issue new access tokens |

Cookies are cleared on logout.

---

## Endpoints

### 1. Register
**Endpoint:** `POST /auth/register`

**Authentication:** Not required

**Description:** Creates a new user account and returns the user along with both tokens set as cookies. Default role is `student` if not provided.

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
- **Cookies set:** `accessToken`, `refreshToken`
- **Response:**
```json
{
  "message": "Account created successfully",
  "data": {
    "_id": "ObjectId",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "",
    "profilePicture": {
      "url": "https://api.dicebear.com/9.x/identicon/svg?seed=..."
    },
    "role": "student",
    "createdAt": "2026-05-03T10:30:00Z",
    "updatedAt": "2026-05-03T10:30:00Z"
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

### 2. Login
**Endpoint:** `POST /auth/login`

**Authentication:** Not required

**Description:** Authenticates a user with email and password. Returns the user and sets both tokens as cookies.

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
    "profilePicture": {
      "url": "https://api.dicebear.com/9.x/identicon/svg?seed=..."
    },
    "role": "student",
    "createdAt": "2026-05-03T10:30:00Z",
    "updatedAt": "2026-05-03T10:30:00Z"
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Invalid email` | `email` is not a valid email format |
| `400 Bad Request` | `Password is required` | `password` is missing or empty |
| `401 Unauthorized` | `Invalid email or password` | No user found with this email, or password does not match |

---

### 3. Logout
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
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired — use `/auth/refresh` first |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |

---

### 4. Refresh Token
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
| `401 Unauthorized` | `You are not authorized` | Token is malformed, user not found, refresh token not in DB, or token does not match stored hash |
