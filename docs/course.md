# Course API Documentation

## Overview
The Course API allows users to create, retrieve, update, and delete courses. Courses are the main content units in the LMS platform, managed by instructors and admins.

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
| Cookie | `accessToken=<token>` (set automatically on login) |
| Header | `Authorization: Bearer <token>` |

If both are present, the cookie takes priority. The token is verified and can produce the following errors:

| Status | Message | Reason |
|--------|---------|--------|
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists in the database |
| `401 Unauthorized` | `Token expired` | Token signature is valid but has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature verification failed |

---

## Endpoints

### 1. Create a Course
**Endpoint:** `POST /courses`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** INSTRUCTOR or ADMIN role

**Description:** Creates a new course. Only instructors and admins can create courses.

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "price": "number (optional, default: 0)",
  "thumbnail": "string (optional, URL to thumbnail image)"
}
```

**Success Response:**
- **Status:** `201 Created`
- **Message:** `Course created successfully`
- **Response:**
```json
{
  "message": "Course created successfully",
  "data": {
    "_id": "ObjectId",
    "title": "Introduction to JavaScript",
    "description": "Learn JavaScript from basics to advanced",
    "instructor": {
      "_id": "ObjectId",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "price": 49.99,
    "thumbnail": "https://example.com/thumbnail.jpg",
    "isPublished": false,
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
| `400 Bad Request` | `Description is required` | `description` is missing or empty |
| `400 Bad Request` | `Description must be 10-500 characters` | `description` length out of range |
| `400 Bad Request` | `Price must be between 0 and 100000` | `price` is not an integer or out of range |
| `400 Bad Request` | `Thumbnail must be a valid URL` | `thumbnail` is not a valid URL |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `Access denied` | Authenticated user does not have INSTRUCTOR or ADMIN role |

---

### 2. Get All Courses
**Endpoint:** `GET /courses`

**Authentication:** Not required

**Description:** Retrieves all **published** courses with pagination support.

**Query Parameters:**
```
page:  number (optional, default: 1, min: 1)
limit: number (optional, default: 10, min: 1, max: 50)
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Courses fetched successfully`
- **Response:**
```json
{
  "message": "Courses fetched successfully",
  "data": {
    "data": [
      {
        "_id": "ObjectId",
        "title": "Introduction to JavaScript",
        "description": "Learn JavaScript from basics to advanced",
        "instructor": {
          "_id": "ObjectId",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "price": 49.99,
        "thumbnail": "https://example.com/thumbnail.jpg",
        "isPublished": true,
        "createdAt": "2026-05-03T10:30:00Z",
        "updatedAt": "2026-05-03T10:30:00Z"
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

**Error Responses:** None

---

### 3. Get Course by ID
**Endpoint:** `GET /courses/:id`

**Authentication:** Not required

**Description:** Retrieves a single course by its ID.

**URL Parameters:**
```
id: string (required) - Course ID
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Course fetched successfully`
- **Response:**
```json
{
  "message": "Course fetched successfully",
  "data": {
    "_id": "ObjectId",
    "title": "Introduction to JavaScript",
    "description": "Learn JavaScript from basics to advanced",
    "instructor": {
      "_id": "ObjectId",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "price": 49.99,
    "thumbnail": "https://example.com/thumbnail.jpg",
    "isPublished": true,
    "createdAt": "2026-05-03T10:30:00Z",
    "updatedAt": "2026-05-03T10:30:00Z"
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Validation failed` | `id` is not a valid MongoDB ObjectId |
| `404 Not Found` | `Course not found` | No course exists with the given `id` |

---

### 4. Get Full Course
**Endpoint:** `GET /courses/:id/full`

**Authentication:** Optional (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any user, authenticated or not

**Description:** Retrieves a course with its full structure — all modules and their nested lessons. If the request includes a valid token, each lesson includes a `completed` boolean based on the user's progress. If not authenticated, lesson completion flags are omitted and progress defaults to zero. Invalid or expired tokens are silently ignored and the request is treated as unauthenticated.

**URL Parameters:**
```
id: string (required) - Course ID
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Course fetched successfully`
- **Response (authenticated):**
```json
{
  "message": "Course fetched successfully",
  "data": {
    "course": {
      "_id": "ObjectId",
      "title": "Introduction to JavaScript",
      "description": "Learn JavaScript from basics to advanced",
      "instructor": {
        "_id": "ObjectId",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "price": 49.99,
      "thumbnail": "https://example.com/thumbnail.jpg",
      "isPublished": true,
      "createdAt": "2026-05-03T10:30:00Z",
      "updatedAt": "2026-05-03T10:30:00Z"
    },
    "modules": [
      {
        "_id": "ObjectId",
        "course": "ObjectId",
        "title": "Getting Started",
        "order": 1,
        "lessons": [
          {
            "_id": "ObjectId",
            "module": "ObjectId",
            "title": "What is JavaScript?",
            "videoUrl": "https://example.com/videos/intro.mp4",
            "content": "Introduction to JavaScript.",
            "order": 1,
            "completed": true
          }
        ]
      }
    ],
    "progress": {
      "percentage": 50,
      "completed": false,
      "lastAccessLesson": "ObjectId"
    }
  }
}
```
- **Response (unauthenticated):**
```json
{
  "message": "Course fetched successfully",
  "data": {
    "course": {
      "_id": "ObjectId",
      "title": "Introduction to JavaScript",
      "description": "Learn JavaScript from basics to advanced",
      "instructor": {
        "_id": "ObjectId",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "price": 49.99,
      "thumbnail": "https://example.com/thumbnail.jpg",
      "isPublished": true,
      "createdAt": "2026-05-03T10:30:00Z",
      "updatedAt": "2026-05-03T10:30:00Z"
    },
    "modules": [
      {
        "_id": "ObjectId",
        "course": "ObjectId",
        "title": "Getting Started",
        "order": 1,
        "lessons": [
          {
            "_id": "ObjectId",
            "module": "ObjectId",
            "title": "What is JavaScript?",
            "videoUrl": "https://example.com/videos/intro.mp4",
            "content": "Introduction to JavaScript.",
            "order": 1
          }
        ]
      }
    ],
    "progress": {
      "percentage": 0,
      "completed": false,
      "lastAccessLesson": null
    }
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Validation failed` | `id` is not a valid MongoDB ObjectId |
| `404 Not Found` | `Course not found` | No course exists with the given `id` |

---

### 5. Update Course
**Endpoint:** `PUT /courses/:id`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** INSTRUCTOR or ADMIN role (must be course owner)

**Description:** Updates course details. Can update title, description, price, thumbnail, and publication status. The response message differs based on whether the course is published after the update.

**URL Parameters:**
```
id: string (required) - Course ID
```

**Request Body (all fields optional):**
```json
{
  "title": "string",
  "description": "string",
  "price": "number",
  "thumbnail": "string",
  "isPublished": "boolean"
}
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Course published successfully` — if `isPublished` is `true` after update
- **Message:** `Course updated successfully` — otherwise
- **Response (course published):**
```json
{
  "message": "Course published successfully",
  "data": {
    "_id": "ObjectId",
    "title": "Introduction to JavaScript",
    "description": "Learn JavaScript from basics to advanced",
    "instructor": {
      "_id": "ObjectId",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "price": 49.99,
    "thumbnail": "https://example.com/thumbnail.jpg",
    "isPublished": true,
    "createdAt": "2026-05-03T10:30:00Z",
    "updatedAt": "2026-05-03T12:00:00Z"
  }
}
```
- **Response (course not published):**
```json
{
  "message": "Course updated successfully",
  "data": {
    "_id": "ObjectId",
    "title": "Introduction to JavaScript",
    "description": "Learn JavaScript from basics to advanced",
    "instructor": {
      "_id": "ObjectId",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "price": 49.99,
    "thumbnail": "https://example.com/thumbnail.jpg",
    "isPublished": false,
    "createdAt": "2026-05-03T10:30:00Z",
    "updatedAt": "2026-05-03T12:00:00Z"
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Title must be 3-50 characters` | `title` length out of range |
| `400 Bad Request` | `Description must be 10-500 characters` | `description` length out of range |
| `400 Bad Request` | `Price must be between 0 and 100000` | `price` is not an integer or out of range |
| `400 Bad Request` | `Thumbnail must be a valid URL` | `thumbnail` is not a valid URL |
| `400 Bad Request` | `Is published must be a boolean` | `isPublished` is not a boolean |
| `400 Bad Request` | `Validation failed` | `id` is not a valid MongoDB ObjectId |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `Access denied` | Authenticated user does not have INSTRUCTOR or ADMIN role |
| `403 Forbidden` | `You are not allowed to modify this course` | Authenticated instructor does not own this course |
| `404 Not Found` | `Course not found` | No course exists with the given `id` |

---

### 6. Delete Course
**Endpoint:** `DELETE /courses/:id`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** INSTRUCTOR or ADMIN role (must be course owner)

**Description:** Permanently deletes a course and all of its associated data, including modules, lessons, enrollments, and progress records.

**URL Parameters:**
```
id: string (required) - Course ID
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Course deleted successfully`
- **Response:**
```json
{
  "message": "Course deleted successfully"
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
| `403 Forbidden` | `You are not allowed to modify this course` | Authenticated instructor does not own this course |
| `404 Not Found` | `Course not found` | No course exists with the given `id` |
