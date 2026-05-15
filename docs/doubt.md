# Doubt API Documentation

## Overview
The Doubt API allows students to ask questions about lessons, instructors and admins to respond, and students to close their own doubts. Each doubt contains a title and an initial description stored as the first reply.

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

All doubt endpoints require a valid access token, accepted in either of two ways:

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

## Doubt Status

| Status | Description |
|--------|-------------|
| `open` | Doubt has been created, awaiting a response |
| `answered` | Doubt has been marked as answered by the instructor or admin |
| `closed` | Doubt has been closed by the student who created it |

---

## Notes

- `description` in `POST /doubts` is stored as the first reply, not on the doubt document itself. The response returns both the created doubt and the first reply.
- Doubts are sorted by `lastReplyAt` descending — most recently active first.
- Replies are sorted by `createdAt` ascending — oldest first.
- `profilePicture` on reply authors is returned as a plain string URL.
- Once a doubt is closed, no further replies or status changes are allowed.

---

## Endpoints

### 1. Create Doubt
**Endpoint:** `POST /doubts`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** ADMIN, the course instructor, or any user enrolled in the course

**Description:** Creates a new doubt for a specific lesson within a course. The `description` is stored as the first reply. Access is granted to admins and the course instructor without enrollment check. All other users must be enrolled in the course.

**Request Body:**
```json
{
  "course": "string (required) - Course ID",
  "lesson": "string (required) - Lesson ID",
  "title": "string (required, 3-100 characters)",
  "description": "string (required, 5-5000 characters)"
}
```

**Success Response:**
- **Status:** `201 Created`
- **Message:** `Doubt created successfully`
- **Response:**
```json
{
  "message": "Doubt created successfully",
  "data": {
    "doubt": {
      "_id": "ObjectId",
      "course": {
        "_id": "ObjectId",
        "title": "Introduction to JavaScript"
      },
      "lesson": {
        "_id": "ObjectId",
        "title": "What is JavaScript?"
      },
      "student": {
        "_id": "ObjectId",
        "name": "John Doe"
      },
      "title": "What is a closure?",
      "status": "open",
      "lastReplyAt": "2026-05-03T10:30:00Z"
    },
    "reply": {
      "_id": "ObjectId",
      "doubt": "ObjectId",
      "author": {
        "_id": "ObjectId",
        "name": "John Doe",
        "profilePicture": "https://api.dicebear.com/9.x/identicon/svg?seed=...",
        "role": "student"
      },
      "message": "I don't understand how closures work in JavaScript.",
      "createdAt": "2026-05-03T10:30:00Z"
    }
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Course id is required` | `course` is missing or empty |
| `400 Bad Request` | `Invalid course id` | `course` is not a valid MongoDB ObjectId |
| `400 Bad Request` | `Lesson id is required` | `lesson` is missing or empty |
| `400 Bad Request` | `Invalid lesson id` | `lesson` is not a valid MongoDB ObjectId |
| `400 Bad Request` | `Title is required` | `title` is missing or empty |
| `400 Bad Request` | `Title must be between 3 and 100 characters` | `title` length out of range |
| `400 Bad Request` | `Description is required` | `description` is missing or empty |
| `400 Bad Request` | `Description must be between 5 and 5000 characters` | `description` length out of range |
| `400 Bad Request` | `This lesson does not belong to the specified course` | `lesson` does not belong to the given `course` |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `You must enroll in this course to ask a doubt` | User is not an admin, not the course instructor, and not enrolled |
| `404 Not Found` | `Course not found` | No course exists with the given `course` ID |
| `404 Not Found` | `Lesson not found` | No lesson exists with the given `lesson` ID |

---

### 2. Get Lesson Doubts
**Endpoint:** `GET /lessons/:id/doubts`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user

**Description:** Retrieves all doubts for a specific lesson, sorted by most recently active.

**URL Parameters:**
```
id: string (required) - Lesson ID
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Doubts fetched successfully`
- **Response:**
```json
{
  "message": "Doubts fetched successfully",
  "data": [
    {
      "_id": "ObjectId",
      "title": "What is a closure?",
      "status": "open",
      "student": {
        "_id": "ObjectId",
        "name": "John Doe"
      },
      "lastReplyAt": "2026-05-03T10:30:00Z"
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
| `404 Not Found` | `Lesson not found` | No lesson exists with the given `id` |

---

### 3. Get My Doubts
**Endpoint:** `GET /doubts/my`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user

**Description:** Retrieves all doubts created by the authenticated user, sorted by most recently active. Returns an empty array if the user has no doubts.

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Doubts fetched successfully`
- **Response:**
```json
{
  "message": "Doubts fetched successfully",
  "data": [
    {
      "_id": "ObjectId",
      "course": "ObjectId",
      "lesson": "ObjectId",
      "title": "What is a closure?",
      "status": "answered",
      "lastReplyAt": "2026-05-04T09:00:00Z"
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

---

### 4. Get Course Doubts
**Endpoint:** `GET /courses/:id/doubts`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** ADMIN or INSTRUCTOR role (must be the course instructor)

**Description:** Retrieves all doubts for a specific course with pagination. Only the course instructor and admins can access this endpoint.

**URL Parameters:**
```
id: string (required) - Course ID
```

**Query Parameters:**
```
page:  number (optional, default: 1, min: 1)
limit: number (optional, default: 10, min: 1, max: 50)
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Doubts fetched successfully`
- **Response:**
```json
{
  "message": "Doubts fetched successfully",
  "data": {
    "data": [
      {
        "_id": "ObjectId",
        "title": "What is a closure?",
        "status": "open",
        "student": {
          "_id": "ObjectId",
          "name": "John Doe"
        },
        "lastReplyAt": "2026-05-03T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3,
      "hasNext": true,
      "hasPrev": false
    }
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
| `403 Forbidden` | `Access denied` | Authenticated user does not have INSTRUCTOR or ADMIN role |
| `403 Forbidden` | `You are not authorized to access this doubt` | Authenticated instructor is not the course instructor |
| `404 Not Found` | `Course not found` | No course exists with the given `id` |

---

### 5. Get Doubt Details
**Endpoint:** `GET /doubts/:id`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user

**Description:** Retrieves a single doubt with all its replies. Replies are sorted oldest first.

**URL Parameters:**
```
id: string (required) - Doubt ID
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Doubt fetched successfully`
- **Response:**
```json
{
  "message": "Doubt fetched successfully",
  "data": {
    "doubt": {
      "_id": "ObjectId",
      "course": {
        "_id": "ObjectId",
        "title": "Introduction to JavaScript"
      },
      "lesson": {
        "_id": "ObjectId",
        "title": "What is JavaScript?"
      },
      "student": {
        "_id": "ObjectId",
        "name": "John Doe"
      },
      "title": "What is a closure?",
      "status": "open",
      "lastReplyAt": "2026-05-03T10:30:00Z"
    },
    "replies": [
      {
        "_id": "ObjectId",
        "doubt": "ObjectId",
        "author": {
          "_id": "ObjectId",
          "name": "John Doe",
          "profilePicture": "https://api.dicebear.com/9.x/identicon/svg?seed=...",
          "role": "student"
        },
        "message": "I don't understand how closures work in JavaScript.",
        "createdAt": "2026-05-03T10:30:00Z"
      }
    ]
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
| `404 Not Found` | `Doubt not found` | No doubt exists with the given `id` |

---

### 6. Reply to Doubt
**Endpoint:** `POST /doubts/:id/replies`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** ADMIN, the course instructor, or the student who created the doubt

**Description:** Adds a reply to an existing doubt. Replies are not allowed on closed doubts.

**URL Parameters:**
```
id: string (required) - Doubt ID
```

**Request Body:**
```json
{
  "message": "string (required, 5-5000 characters)"
}
```

**Success Response:**
- **Status:** `201 Created`
- **Message:** `Reply added successfully`
- **Response:**
```json
{
  "message": "Reply added successfully",
  "data": {
    "_id": "ObjectId",
    "doubt": "ObjectId",
    "author": {
      "_id": "ObjectId",
      "name": "Jane Smith",
      "profilePicture": "https://example.com/avatar.jpg",
      "role": "instructor"
    },
    "message": "A closure is a function that retains access to its outer scope.",
    "createdAt": "2026-05-03T11:00:00Z"
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Message is required` | `message` is missing or empty |
| `400 Bad Request` | `Message must be between 5 and 5000 characters` | `message` length out of range |
| `400 Bad Request` | `Validation failed` | `id` is not a valid MongoDB ObjectId |
| `400 Bad Request` | `This doubt is already closed` | Doubt status is `closed` |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `You are not authorized to access this doubt` | User is not the admin, course instructor, or the doubt's student |
| `404 Not Found` | `Doubt not found` | No doubt exists with the given `id` |

---

### 7. Mark Doubt as Answered
**Endpoint:** `PUT /doubts/:id/mark-answered`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** ADMIN or INSTRUCTOR role (must be the course instructor)

**Description:** Marks a doubt as answered. Cannot be applied to doubts that are already answered or closed.

**URL Parameters:**
```
id: string (required) - Doubt ID
```

**Request Body:** None

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Doubt marked as answered successfully`
- **Response:**
```json
{
  "message": "Doubt marked as answered successfully",
  "data": {
    "_id": "ObjectId",
    "course": {
      "_id": "ObjectId",
      "title": "Introduction to JavaScript"
    },
    "lesson": {
      "_id": "ObjectId",
      "title": "What is JavaScript?"
    },
    "student": {
      "_id": "ObjectId",
      "name": "John Doe"
    },
    "title": "What is a closure?",
    "status": "answered",
    "lastReplyAt": "2026-05-03T11:00:00Z"
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Validation failed` | `id` is not a valid MongoDB ObjectId |
| `400 Bad Request` | `This doubt is already closed` | Doubt status is `closed` |
| `400 Bad Request` | `This doubt is already answered` | Doubt status is already `answered` |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `Access denied` | Authenticated user does not have INSTRUCTOR or ADMIN role |
| `403 Forbidden` | `Only the course instructor or admin can mark this doubt as answered` | Authenticated instructor is not the course instructor |
| `404 Not Found` | `Doubt not found` | No doubt exists with the given `id` |

---

### 8. Close Doubt
**Endpoint:** `PUT /doubts/:id/close`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** The student who created the doubt only

**Description:** Closes a doubt permanently. Only the student who created the doubt can close it. Once closed, no further replies or status changes are allowed.

**URL Parameters:**
```
id: string (required) - Doubt ID
```

**Request Body:** None

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Doubt closed successfully`
- **Response:**
```json
{
  "message": "Doubt closed successfully",
  "data": {
    "_id": "ObjectId",
    "course": {
      "_id": "ObjectId",
      "title": "Introduction to JavaScript"
    },
    "lesson": {
      "_id": "ObjectId",
      "title": "What is JavaScript?"
    },
    "student": {
      "_id": "ObjectId",
      "name": "John Doe"
    },
    "title": "What is a closure?",
    "status": "closed",
    "lastReplyAt": "2026-05-03T11:00:00Z"
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Validation failed` | `id` is not a valid MongoDB ObjectId |
| `400 Bad Request` | `This doubt is already closed` | Doubt status is already `closed` |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `Only the student who created this doubt can close it` | Authenticated user is not the doubt's student |
| `404 Not Found` | `Doubt not found` | No doubt exists with the given `id` |