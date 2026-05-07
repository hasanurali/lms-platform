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

- `password` and `refreshToken` are never returned in any response — they are stripped by the model's `toJSON()` method.
- `profilePicture` defaults to an auto-generated dicebear avatar URL if not set.
- `bio` defaults to an empty string `""`.
- `GET /users/` excludes admin accounts from results.

---

## Endpoints

### 1. Get Current User
**Endpoint:** `GET /users/me`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user

**Description:** Returns the profile of the currently authenticated user. Data is read directly from the auth token — no additional database call is made.

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
    "profilePicture": "https://api.dicebear.com/9.x/identicon/svg?seed=...",
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
      "profilePicture": "https://api.dicebear.com/9.x/identicon/svg?seed=...",
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
    "profilePicture": "https://api.dicebear.com/9.x/identicon/svg?seed=...",
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

**Description:** Updates the authenticated user's profile. Only fields provided in the request body are updated; omitted fields remain unchanged.

**Request Body (all fields optional):**
```json
{
  "name": "string",
  "profilePicture": "string (valid URL)",
  "bio": "string (max 500 characters)"
}
```

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
    "profilePicture": "https://example.com/avatar.jpg",
    "role": "student",
    "createdAt": "2026-05-03T10:30:00Z",
    "updatedAt": "2026-05-04T09:00:00Z"
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |