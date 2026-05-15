# Progress API Documentation

## Overview
The Progress API allows authenticated users to track their learning progress within a course. It supports fetching current progress, marking lessons as complete, and updating the last accessed lesson.

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

All progress endpoints require a valid access token, accepted in either of two ways:

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

- Any authenticated user can access progress endpoints regardless of role, provided they are enrolled in the course.
- All three endpoints require the user to be enrolled — unenrolled users receive a `403` error.
- Progress is tracked per user per course via a unique `{ user, course }` index.
- If enrolled but no progress record exists yet, `GET /progress/:courseId` returns a default response with `0%` progress rather than a 404.
- `completedLessons` uses a set — marking the same lesson complete multiple times has no effect.
- A course is automatically marked `completed: true` when all lessons in the course are completed.
- If a course is already marked completed, `POST /progress/complete-lesson` returns immediately with the existing progress.
- `POST /progress/last-lesson` creates a progress record if one does not exist yet.

---

## Endpoints

### 1. Get Progress
**Endpoint:** `GET /progress/:courseId`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user enrolled in the course

**Description:** Retrieves the authenticated user's progress for a specific course. The user must be enrolled in the course.

**URL Parameters:**
```
courseId: string (required) - Course ID
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Progress fetched successfully`
- **Response (progress exists):**
```json
{
  "message": "Progress fetched successfully",
  "data": {
    "progress": {
      "_id": "ObjectId",
      "user": "ObjectId",
      "course": "ObjectId",
      "completedLessons": ["ObjectId", "ObjectId"],
      "lastAccessLesson": "ObjectId",
      "completed": false
    },
    "progressPercentage": 40
  }
}
```
- **Response (enrolled but no progress yet):**
```json
{
  "message": "Progress fetched successfully",
  "data": {
    "progress": {
      "completedLessons": [],
      "lastAccessLesson": null,
      "completed": false
    },
    "progressPercentage": 0
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Validation failed` | `courseId` is not a valid MongoDB ObjectId |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `You must enroll in this course to access this content` | Authenticated user is not enrolled in this course |
| `404 Not Found` | `Course not found` | No course exists with the given `courseId` |

---

### 2. Complete Lesson
**Endpoint:** `POST /progress/complete-lesson`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user enrolled in the course

**Description:** Marks a lesson as completed for the authenticated user within a course. The user must be enrolled in the course. If all lessons in the course are completed, the course is automatically marked as completed. Marking an already-completed lesson has no effect. If the course is already completed, the existing progress is returned immediately.

**Request Body:**
```json
{
  "course": "string (required) - Course ID",
  "lesson": "string (required) - Lesson ID"
}
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Course completed successfully` — if all lessons are now completed
- **Message:** `Progress updated successfully` — otherwise
- **Response (course completed):**
```json
{
  "message": "Course completed successfully",
  "data": {
    "_id": "ObjectId",
    "user": "ObjectId",
    "course": "ObjectId",
    "completedLessons": ["ObjectId", "ObjectId", "ObjectId"],
    "lastAccessLesson": "ObjectId",
    "completed": true
  }
}
```
- **Response (progress updated):**
```json
{
  "message": "Progress updated successfully",
  "data": {
    "_id": "ObjectId",
    "user": "ObjectId",
    "course": "ObjectId",
    "completedLessons": ["ObjectId"],
    "lastAccessLesson": "ObjectId",
    "completed": false
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Validation failed` | `course` or `lesson` is not a valid MongoDB ObjectId |
| `400 Bad Request` | `This lesson does not belong to the specified course` | `lesson` does not belong to the given `course` |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `You must enroll in this course to access this content` | Authenticated user is not enrolled in this course |
| `404 Not Found` | `Course not found` | No course exists with the given `course` ID |

---

### 3. Set Last Accessed Lesson
**Endpoint:** `POST /progress/last-lesson`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user enrolled in the course

**Description:** Updates the last accessed lesson for the authenticated user within a course. The user must be enrolled in the course. Creates a progress record if one does not exist yet. Does not affect completed lessons or completion status.

**Request Body:**
```json
{
  "course": "string (required) - Course ID",
  "lesson": "string (required) - Lesson ID"
}
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Progress updated successfully`
- **Response:**
```json
{
  "message": "Progress updated successfully",
  "data": {
    "_id": "ObjectId",
    "user": "ObjectId",
    "course": "ObjectId",
    "completedLessons": ["ObjectId"],
    "lastAccessLesson": "ObjectId",
    "completed": false
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Validation failed` | `course` or `lesson` is not a valid MongoDB ObjectId |
| `400 Bad Request` | `This lesson does not belong to the specified course` | `lesson` does not belong to the given `course` |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `You must enroll in this course to access this content` | Authenticated user is not enrolled in this course |
| `404 Not Found` | `Course not found` | No course exists with the given `course` ID |