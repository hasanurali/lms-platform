# Module API Documentation

## Overview
The Module API allows instructors and admins to create, update, and delete modules within a course. Any authenticated user can retrieve modules. Modules are ordered automatically based on creation sequence.

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

- **Module order** is assigned automatically. The first module in a course gets `order: 1`; each subsequent module increments by 1. Order cannot be set or changed via the API.
- Modules are always returned sorted by `order` ascending.

---

## Endpoints

### 1. Create Module
**Endpoint:** `POST /courses/:id/modules`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** INSTRUCTOR or ADMIN role (must own the course)

**Description:** Creates a new module under the specified course. The `order` field is assigned automatically.

**URL Parameters:**
```
id: string (required) - Course ID
```

**Request Body:**
```json
{
  "title": "string (required)"
}
```

**Success Response:**
- **Status:** `201 Created`
- **Message:** `Module created successfully`
- **Response:**
```json
{
  "message": "Module created successfully",
  "data": {
    "_id": "ObjectId",
    "course": "ObjectId",
    "title": "Introduction to Variables",
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
| `400 Bad Request` | `Validation failed` | `id` is not a valid MongoDB ObjectId |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `Access denied` | Authenticated user does not have INSTRUCTOR or ADMIN role |
| `403 Forbidden` | `You are not allowed to modify this module` | Authenticated instructor does not own the course this module belongs to |
| `404 Not Found` | `Course not found` | No course exists with the given `id` |

---

### 2. Get Modules
**Endpoint:** `GET /courses/:id/modules`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** Any authenticated user

**Description:** Retrieves all modules for the specified course, sorted by `order` ascending.

**URL Parameters:**
```
id: string (required) - Course ID
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Modules fetched successfully`
- **Response:**
```json
{
  "message": "Modules fetched successfully",
  "data": [
    {
      "_id": "ObjectId",
      "course": "ObjectId",
      "title": "Introduction to Variables",
      "order": 1,
      "createdAt": "2026-05-03T10:30:00Z",
      "updatedAt": "2026-05-03T10:30:00Z"
    },
    {
      "_id": "ObjectId",
      "course": "ObjectId",
      "title": "Functions and Scope",
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
| `404 Not Found` | `Course not found` | No course exists with the given `id` |

---

### 3. Update Module
**Endpoint:** `PUT /modules/:id`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** INSTRUCTOR or ADMIN role (must own the course this module belongs to)

**Description:** Updates the `title` of a module. Only `title` can be updated; `order` cannot be changed.

**URL Parameters:**
```
id: string (required) - Module ID
```

**Request Body:**
```json
{
  "title": "string (optional)"
}
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Module updated successfully`
- **Response:**
```json
{
  "message": "Module updated successfully",
  "data": {
    "_id": "ObjectId",
    "course": "ObjectId",
    "title": "Updated Module Title",
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
| `400 Bad Request` | `Validation failed` | `id` is not a valid MongoDB ObjectId |
| `401 Unauthorized` | `You are not authorized` | No token provided, or user no longer exists |
| `401 Unauthorized` | `Token expired` | Access token has expired |
| `401 Unauthorized` | `Invalid token` | Token is malformed or signature is invalid |
| `403 Forbidden` | `Access denied` | Authenticated user does not have INSTRUCTOR or ADMIN role |
| `403 Forbidden` | `You are not allowed to modify this module` | Authenticated instructor does not own the course this module belongs to |
| `404 Not Found` | `Module not found` | No module exists with the given `id` |

---

### 4. Delete Module
**Endpoint:** `DELETE /modules/:id`

**Authentication:** Required (cookie `accessToken` or `Authorization: Bearer <token>`)

**Authorization:** INSTRUCTOR or ADMIN role (must own the course this module belongs to)

**Description:** Permanently deletes a module and all of its associated lessons.

**URL Parameters:**
```
id: string (required) - Module ID
```

**Success Response:**
- **Status:** `200 OK`
- **Message:** `Module deleted successfully`
- **Response:**
```json
{
  "message": "Module deleted successfully"
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
| `403 Forbidden` | `You are not allowed to modify this module` | Authenticated instructor does not own the course this module belongs to |
| `404 Not Found` | `Module not found` | No module exists with the given `id` |
