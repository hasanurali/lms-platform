# Lesson API Documentation

## Overview
The Lesson API allows instructors and admins to create, update, and delete lessons within a module. Any authenticated user can retrieve lessons. Lessons are ordered automatically based on creation sequence.

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

Protected endpoints require a valid access token, accepted in either of two ways:

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

- **Lesson order** is assigned automatically. The first lesson in a module gets `order: 1`; each subsequent lesson increments by 1. Order cannot be set or changed via the API.
- Lessons are always returned sorted by `order` ascending.
- `content` is optional and defaults to `null` if not provided.

---

## Endpoints

### 1. Create Lesson
**Endpoint:** `POST /modules/:id/lessons`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** INSTRUCTOR or ADMIN role (must own the course this lesson's module belongs to)

**Description:** Creates a new lesson under the specified module. The `order` field is assigned automatically.

**URL Parameters:**
```
id: string (required) - Module ID
```

**Request Body:**
```json
{
  "title": "string (required)",
  "videoUrl": "string (required)",
  "content": "string (optional, max 1000 characters)"
}
```

**Success Response:**
- **Status:** `201 Created`
- **Message:** `Lesson created successfully`
- **Response:**
```json
{
  "message": "Lesson created successfully",
  "data": {
    "_id": "ObjectId",
    "module": "ObjectId",
    "title": "What is JavaScript?",
    "videoUrl": "https://example.com/videos/intro.mp4",
    "content": "In this lesson we cover the basics of JavaScript.",
    "order": 1,
    "createdAt": "2026-05-03T10:30:00Z",
    "updatedAt": "2026-05-03T10:30:00Z"
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Title is required` | `title` is missing or empty |
| `400 Bad Request` | `Title must be 3-50 characters` | `title` length out of range |
| `400 Bad Request` | `Video url is required` | `videoUrl` is missing or empty |
| `400 Bad Request` | `Video url must be a valid URL` | `videoUrl` is not a valid URL |
| `400 Bad Request` | `Content must be less than 1000 characters` | `content` exceeds 1000 characters |
| `400 Bad Request` | `Validation failed` | `id` is not a valid MongoDB ObjectId |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `Access denied` | Authenticated user does not have INSTRUCTOR or ADMIN role |
| `403 Forbidden` | `You are not allowed to modify this lesson` | Authenticated instructor does not own the course this lesson's module belongs to |
| `404 Not Found` | `Module not found` | No module exists with the given `id` |

---

### 2. Get Lessons
**Endpoint:** `GET /modules/:id/lessons`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user

**Description:** Retrieves all lessons for the specified module, sorted by `order` ascending.

**URL Parameters:**
```
id: string (required) - Module ID
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Lessons fetched successfully`
- **Response:**
```json
{
  "message": "Lessons fetched successfully",
  "data": [
    {
      "_id": "ObjectId",
      "module": "ObjectId",
      "title": "What is JavaScript?",
      "videoUrl": "https://example.com/videos/intro.mp4",
      "content": "In this lesson we cover the basics of JavaScript.",
      "order": 1,
      "createdAt": "2026-05-03T10:30:00Z",
      "updatedAt": "2026-05-03T10:30:00Z"
    },
    {
      "_id": "ObjectId",
      "module": "ObjectId",
      "title": "Variables and Data Types",
      "videoUrl": "https://example.com/videos/variables.mp4",
      "content": null,
      "order": 2,
      "createdAt": "2026-05-03T11:00:00Z",
      "updatedAt": "2026-05-03T11:00:00Z"
    }
  ]
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Validation failed` | `id` is not a valid MongoDB ObjectId |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `404 Not Found` | `Module not found` | No module exists with the given `id` |

---

### 3. Get Lesson
**Endpoint:** `GET /lessons/:id`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user

**Description:** Retrieves a single lesson by its ID.

**URL Parameters:**
```
id: string (required) - Lesson ID
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Lesson fetched successfully`
- **Response:**
```json
{
  "message": "Lesson fetched successfully",
  "data": {
    "_id": "ObjectId",
    "module": "ObjectId",
    "title": "What is JavaScript?",
    "videoUrl": "https://example.com/videos/intro.mp4",
    "content": "In this lesson we cover the basics of JavaScript.",
    "order": 1,
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
| `404 Not Found` | `Lesson not found` | No lesson exists with the given `id` |

---

### 4. Update Lesson
**Endpoint:** `PUT /lessons/:id`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** INSTRUCTOR or ADMIN role (must own the course this lesson belongs to)

**Description:** Updates lesson fields. Only fields provided in the request body are updated; omitted fields remain unchanged. `order` cannot be changed.

**URL Parameters:**
```
id: string (required) - Lesson ID
```

**Request Body (all fields optional):**
```json
{
  "title": "string",
  "videoUrl": "string",
  "content": "string (max 1000 characters)"
}
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Lesson updated successfully`
- **Response:**
```json
{
  "message": "Lesson updated successfully",
  "data": {
    "_id": "ObjectId",
    "module": "ObjectId",
    "title": "Updated Lesson Title",
    "videoUrl": "https://example.com/videos/updated.mp4",
    "content": "Updated content here.",
    "order": 1,
    "createdAt": "2026-05-03T10:30:00Z",
    "updatedAt": "2026-05-03T12:00:00Z"
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Title must be 3-50 characters` | `title` is provided but length is out of range |
| `400 Bad Request` | `Video url must be a valid URL` | `videoUrl` is provided but not a valid URL |
| `400 Bad Request` | `Content must be less than 1000 characters` | `content` exceeds 1000 characters |
| `400 Bad Request` | `Validation failed` | `id` is not a valid MongoDB ObjectId |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `Access denied` | Authenticated user does not have INSTRUCTOR or ADMIN role |
| `403 Forbidden` | `You are not allowed to modify this lesson` | Authenticated instructor does not own the course this lesson belongs to |
| `404 Not Found` | `Lesson not found` | No lesson exists with the given `id` |

---

### 5. Delete Lesson
**Endpoint:** `DELETE /lessons/:id`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** INSTRUCTOR or ADMIN role (must own the course this lesson belongs to)

**Description:** Permanently deletes a lesson.

**URL Parameters:**
```
id: string (required) - Lesson ID
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Lesson deleted successfully`
- **Response:**
```json
{
  "message": "Lesson deleted successfully"
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Validation failed` | `id` is not a valid MongoDB ObjectId |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `Access denied` | Authenticated user does not have INSTRUCTOR or ADMIN role |
| `403 Forbidden` | `You are not allowed to modify this lesson` | Authenticated instructor does not own the course this lesson belongs to |
| `404 Not Found` | `Lesson not found` | No lesson exists with the given `id` |