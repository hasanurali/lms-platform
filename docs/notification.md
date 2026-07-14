# Notification API Documentation

## Overview
The Notification API allows authenticated users to retrieve and manage their notifications. Notifications are created automatically by the system when key events occur — such as enrolling in a course, completing a course, receiving a reply to a doubt, or a new review being submitted.

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

All notification endpoints require a valid access token, accepted in either of two ways:

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

## Notification Types

| Type | Triggered by |
|------|-------------|
| `system` | Account registration |
| `enrollment` | Enrolling in a course |
| `progress` | Completing a course |
| `doubt` | New doubt posted, or a reply added to a doubt |
| `review` | A student submits a review on an instructor's course |
| `course` | Course published successfully |

---

## Notes

- Notifications are always returned sorted by `createdAt` descending — most recent first.
- Only the user who owns a notification can mark it as read.
- `metadata` contains optional ObjectId references relevant to the notification type. Fields not applicable to the event are absent.
- Notifications are created as fire-and-forget — failures do not affect the triggering operation.

---

## Endpoints

### 1. Get Notifications
**Endpoint:** `GET /notifications/`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user

**Description:** Retrieves the authenticated user's notifications with pagination, sorted by most recent first.

**Query Parameters:**
```
page:  number (optional, default: 1, min: 1)
limit: number (optional, default: 10, min: 1, max: 50)
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Notifications fetched successfully`
- **Response:**
```json
{
  "message": "Notifications fetched successfully",
  "data": {
    "data": [
      {
        "_id": "ObjectId",
        "title": "New Reply to Your Doubt",
        "message": "Your doubt received a new reply.",
        "type": "doubt",
        "isRead": false,
        "metadata": {
          "course": "ObjectId",
          "lesson": "ObjectId",
          "doubt": "ObjectId"
        },
        "createdAt": "2026-05-03T11:00:00Z"
      },
      {
        "_id": "ObjectId",
        "title": "Enrollment Successful",
        "message": "You enrolled in Introduction to JavaScript.",
        "type": "enrollment",
        "isRead": true,
        "metadata": {
          "course": "ObjectId",
          "enrollment": "ObjectId"
        },
        "createdAt": "2026-05-03T10:30:00Z"
      }
    ],
    "markedNotifications": 10,
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
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |

---

### 2. Mark All Notifications as Read
**Endpoint:** `PUT /notifications/read-all`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user

**Description:** Marks all unread notifications for the authenticated user as read. Returns the count of notifications that were updated.

**Request Body:** None

**Success Response:**
- **Status:** `200 OK`
- **Message:** `All notifications marked as read successfully`
- **Response:**
```json
{
  "message": "All notifications marked as read successfully",
  "data": {
    "modifiedCount": 5
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

### 3. Mark Notification as Read
**Endpoint:** `PUT /notifications/:id/read`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** The user who owns the notification

**Description:** Marks a single notification as read by its ID.

**URL Parameters:**
```
id: string (required) - Notification ID
```

**Request Body:** None

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Notification marked as read successfully`
- **Response:**
```json
{
  "message": "Notification marked as read successfully",
  "data": {
    "_id": "ObjectId",
    "title": "New Reply to Your Doubt",
    "message": "Your doubt received a new reply.",
    "type": "doubt",
    "isRead": true,
    "metadata": {
      "course": "ObjectId",
      "lesson": "ObjectId",
      "doubt": "ObjectId"
    },
    "createdAt": "2026-05-03T11:00:00Z"
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
| `403 Forbidden` | `You are not authorized to modify this notification` | Authenticated user does not own this notification |
| `404 Not Found` | `Notification not found` | No notification exists with the given `id` |