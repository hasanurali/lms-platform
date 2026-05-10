# User API Documentation

## Overview
The User API allows users to view their own profile, retrieve other users, and update their profile. Admin-only endpoints provide access to all users.

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

## Authentication

All user endpoints require a valid access token, accepted in either of two ways:

| Method | Format |
|--------|--------|
| Cookie | `accessToken=<token>` |
| Header | `Authorization: Bearer <token>` |

If both are present, the cookie takes priority.

| Status | Message | Reason |
|--------|---------|--------|
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |

---

## Notes

- `password`, `refreshToken`, `profilePicture.publicId`, and `profilePicture.hash` are never returned in any response — they are stripped by the model's `toJSON()` method. Only `profilePicture.url` is exposed.
- `profilePicture.url` defaults to an auto-generated dicebear avatar URL if not set.
- `bio` defaults to an empty string `""`.
- `GET /users/` excludes admin accounts from results.
- If a new profile picture is uploaded and it matches the existing one (checked by MD5 hash), the existing image is kept and no Cloudinary upload occurs.

---

## Endpoints

### 1. Get Current User
**Endpoint:** `GET /users/me`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user

**Description:** Returns the profile of the currently authenticated user. Data is read directly from the auth middleware — no additional database call is made.

**Success Response:**
- **Status:** `200 OK`
- **Message:** `User fetched successfully`
- **Response:**
```json
{
  "message": "User fetched successfully",
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
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |

---

### 2. Get All Users
**Endpoint:** `GET /users/`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** ADMIN role only

**Description:** Retrieves all users excluding admin accounts.

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Users fetched successfully`
- **Response:**
```json
{
  "message": "Users fetched successfully",
  "data": [
    {
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
  ]
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `Access denied` | Authenticated user does not have ADMIN role |

---

### 3. Get User by ID
**Endpoint:** `GET /users/:id`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user

**Description:** Retrieves a single user by their ID.

**URL Parameters:**
```
id: string (required) - User ID
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `User fetched successfully`
- **Response:**
```json
{
  "message": "User fetched successfully",
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
| `400 Bad Request` | `Validation failed` | `id` is not a valid MongoDB ObjectId |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `404 Not Found` | `User not found` | No user exists with the given `id` |

---

### 4. Update Profile
**Endpoint:** `PUT /users/me`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user

**Description:** Updates the authenticated user's profile. Only fields provided are updated. If a new profile picture is uploaded and differs from the existing one, the old image is deleted from Cloudinary and replaced.

**Request Body:** `multipart/form-data` (all fields optional)

| Field | Type | Required |
|-------|------|----------|
| `name` | string (3-30 characters, letters only) | No |
| `bio` | string (max 500 characters) | No |
| `profilePicture` | file (jpg, jpeg, png, webp, max 2MB) | No |

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Profile updated successfully`
- **Response:**
```json
{
  "message": "Profile updated successfully",
  "data": {
    "_id": "ObjectId",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Updated bio here.",
    "profilePicture": {
      "url": "https://res.cloudinary.com/example/avatar.jpg"
    },
    "role": "student",
    "createdAt": "2026-05-03T10:30:00Z",
    "updatedAt": "2026-05-04T09:00:00Z"
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Name must be 3-30 characters` | `name` length out of range |
| `400 Bad Request` | `Name must contain only letters` | `name` contains non-letter characters |
| `400 Bad Request` | `Bio must be less than 500 characters` | `bio` exceeds 500 characters |
| `400 Bad Request` | `Only jpg, jpeg, png and webp files are allowed` | Uploaded file has an invalid type |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `404 Not Found` | `User not found` | No user exists with the given ID |