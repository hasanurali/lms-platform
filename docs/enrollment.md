# Enrollment API Documentation

## Overview
The Enrollment API allows authenticated users to enroll in courses and retrieve their enrolled courses. Any authenticated user can enroll regardless of role.

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

All enrollment endpoints require a valid access token, accepted in either of two ways:

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

- Any authenticated user can enroll in a course regardless of role.
- A user can only enroll in the same course once.
- `course.thumbnail` is returned as a plain string URL.
- `GET /enrollments/my` always returns an array; empty array if the user has no enrollments.
- A welcome notification is sent to the user upon successful enrollment.

---

## Endpoints

### 1. Enroll in a Course
**Endpoint:** `POST /courses/:id/enroll`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user

**Description:** Enrolls the authenticated user in the specified course.

**URL Parameters:**
```
id: string (required) - Course ID
```

**Request Body:** None

**Success Response:**
- **Status:** `201 Created`
- **Message:** `Successfully enrolled in the course`
- **Response:**
```json
{
  "message": "Successfully enrolled in the course",
  "data": {
    "_id": "ObjectId",
    "user": "ObjectId",
    "course": {
      "_id": "ObjectId",
      "title": "Introduction to JavaScript",
      "description": "Learn JavaScript from basics to advanced",
      "thumbnail": "https://res.cloudinary.com/example/thumbnail.jpg",
      "instructor": "ObjectId",
      "price": 49.99,
      "isPublished": true,
      "averageRating": 4.5,
      "totalReviews": 120,
      "ratingDistribution": { "1": 2, "2": 3, "3": 10, "4": 35, "5": 70 }
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
| `404 Not Found` | `Course not found` | No course exists with the given `id` |
| `409 Conflict` | `You are already enrolled in this course` | User is already enrolled in this course |

---

### 2. Get My Enrollments
**Endpoint:** `GET /enrollments/my`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user

**Description:** Retrieves all courses the authenticated user is enrolled in. Returns an empty array if the user has no enrollments.

**Request Body:** None

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Enrolled courses fetched successfully`
- **Response:**
```json
{
  "message": "Enrolled courses fetched successfully",
  "data": [
    {
      "_id": "ObjectId",
      "user": "ObjectId",
      "course": {
        "_id": "ObjectId",
        "title": "Introduction to JavaScript",
        "description": "Learn JavaScript from basics to advanced",
        "thumbnail": "https://res.cloudinary.com/example/thumbnail.jpg",
        "instructor": "ObjectId",
        "price": 49.99,
        "isPublished": true,
        "averageRating": 4.5,
        "totalReviews": 120,
        "ratingDistribution": { "1": 2, "2": 3, "3": 10, "4": 35, "5": 70 }
      }
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