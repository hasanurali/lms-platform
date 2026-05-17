# Review API Documentation

## Overview
The Review API allows enrolled students to leave reviews on courses, retrieve reviews, and manage their own reviews. Course ratings are automatically recalculated after every create, update, or delete.

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

- A student can only submit one review per course.
- The course instructor cannot review their own course.
- Only enrolled students can submit reviews.
- Only the student who created a review can update or delete it.
- After every create, update, or delete, the course's `averageRating`, `totalReviews`, and `ratingDistribution` are automatically recalculated.
- Reviews are returned sorted by rating descending.
- `student.profilePicture` is returned as a plain string URL.

---

## Endpoints

### 1. Create Review
**Endpoint:** `POST /courses/:id/reviews`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user enrolled in the course (instructor cannot review their own course)

**Description:** Submits a review for a course. The student must be enrolled and must not have already reviewed the course.

**URL Parameters:**
```
id: string (required) - Course ID
```

**Request Body:**
```json
{
  "rating": "number (required, 1-5)",
  "message": "string (required, 10-500 characters)"
}
```

**Success Response:**
- **Status:** `201 Created`
- **Message:** `Review created successfully`
- **Notification sent:** A notification is sent to the course instructor when a new review is submitted.
- **Response:**
```json
{
  "message": "Review created successfully",
  "data": {
    "_id": "ObjectId",
    "course": "ObjectId",
    "student": {
      "_id": "ObjectId",
      "name": "John Doe",
      "profilePicture": "https://api.dicebear.com/9.x/identicon/svg?seed=..."
    },
    "rating": 5,
    "message": "This course is excellent! Very well explained.",
    "createdAt": "2026-05-03T10:30:00Z"
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Rating is required` | `rating` is missing or empty |
| `400 Bad Request` | `Rating must be between 1 and 5` | `rating` is not an integer between 1 and 5 |
| `400 Bad Request` | `Review message is required` | `message` is missing or empty |
| `400 Bad Request` | `Review message must be between 10 and 500 characters` | `message` length out of range |
| `400 Bad Request` | `Validation failed` | `id` is not a valid MongoDB ObjectId |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `Instructor cannot review their own course` | Authenticated user is the course instructor |
| `403 Forbidden` | `You must be enrolled in this course to submit a review` | Authenticated user is not enrolled in the course |
| `404 Not Found` | `Course not found` | No course exists with the given `id` |
| `409 Conflict` | `You have already reviewed this course` | Student has already submitted a review for this course |

---

### 2. Get Reviews
**Endpoint:** `GET /courses/:id/reviews`

**Authentication:** Not required

**Authorization:** None

**Description:** Retrieves all reviews for a specific course with pagination. Reviews are sorted by rating descending.

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
- **Message:** `Reviews fetched successfully`
- **Response:**
```json
{
  "message": "Reviews fetched successfully",
  "data": {
    "data": [
      {
        "_id": "ObjectId",
        "course": "ObjectId",
        "student": {
          "_id": "ObjectId",
          "name": "John Doe",
          "profilePicture": "https://api.dicebear.com/9.x/identicon/svg?seed=..."
        },
        "rating": 5,
        "message": "This course is excellent! Very well explained.",
        "createdAt": "2026-05-03T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "pages": 5,
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
| `404 Not Found` | `Course not found` | No course exists with the given `id` |

---

### 3. Update Review
**Endpoint:** `PUT /reviews/:id`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** The student who created the review

**Description:** Updates the authenticated student's review. Only fields provided are updated.

**URL Parameters:**
```
id: string (required) - Review ID
```

**Request Body (all fields optional):**
```json
{
  "rating": "number (1-5)",
  "message": "string (10-500 characters)"
}
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Review updated successfully`
- **Response:**
```json
{
  "message": "Review updated successfully",
  "data": {
    "_id": "ObjectId",
    "course": "ObjectId",
    "student": {
      "_id": "ObjectId",
      "name": "John Doe",
      "profilePicture": "https://api.dicebear.com/9.x/identicon/svg?seed=..."
    },
    "rating": 4,
    "message": "Updated review message here.",
    "createdAt": "2026-05-03T10:30:00Z"
  }
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Rating must be between 1 and 5` | `rating` is provided but not a valid integer between 1 and 5 |
| `400 Bad Request` | `Review message must be between 10 and 500 characters` | `message` is provided but length out of range |
| `400 Bad Request` | `Validation failed` | `id` is not a valid MongoDB ObjectId |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `You are not authorized to modify this review` | Authenticated user did not create this review |
| `404 Not Found` | `Review not found` | No review exists with the given `id` |

---

### 4. Delete Review
**Endpoint:** `DELETE /reviews/:id`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** The student who created the review

**Description:** Permanently deletes the authenticated student's review. The course rating is recalculated after deletion.

**URL Parameters:**
```
id: string (required) - Review ID
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Review deleted successfully`
- **Response:**
```json
{
  "message": "Review deleted successfully"
}
```

**Error Responses:**

| Status | Message | Reason |
|--------|---------|--------|
| `400 Bad Request` | `Validation failed` | `id` is not a valid MongoDB ObjectId |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `You are not authorized to modify this review` | Authenticated user did not create this review |
| `404 Not Found` | `Review not found` | No review exists with the given `id` |