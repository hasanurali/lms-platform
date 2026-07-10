# Socket.IO Real-Time Communication

## Overview

The LMS platform uses Socket.IO to provide real-time features including instant notifications and live doubt discussions. The Socket.IO server integrates with the Express HTTP server and requires JWT authentication for all connections.

## Initialization

Socket.IO is initialized in [server/src/server.js](../server/src/server.js) using an HTTP server instance:

```javascript
import http from "http";
import { initializeSocket } from "./socket/socket.js";

const server = http.createServer(app);
initializeSocket(server);
```

Configuration in [server/src/socket/socket.js](../server/src/socket/socket.js):

```javascript
io = new Server(server, {
    cors: {
        origin: config.clientUrl || "*",
        credentials: true
    }
});
```

## Authentication

Socket connections require valid JWT authentication during the handshake. The `accessToken` is extracted from cookies and verified:

```javascript
io.use((socket, next) => {
    try {
        const cookies = parse(socket.handshake.headers.cookie || "");
        const accessToken = cookies.accessToken;

        if (!accessToken) {
            return next(new Error("Authentication required"));
        }

        const decoded = jwt.verify(accessToken, config.jwt.ACCESS.SECRET);
        socket.user = { id: decoded.id };

        next();
    } catch {
        next(new Error("Authentication failed"));
    }
});
```

**Key requirements:**
- Valid JWT `accessToken` in cookies
- Token verified using `config.jwt.ACCESS.SECRET`
- Expired or invalid tokens result in connection rejection
- User ID available as `socket.user.id`

## Rooms

Upon connection, users automatically join:

| Room | Format | Purpose |
|------|--------|---------|
| User Room | `user:<userId>` | Private notifications and personal messages |
| Global Room | `global` | Platform-wide broadcasts |
| Doubt Room | `doubt:<doubtId>` | Doubt discussions (joined dynamically) |

Users can join and leave doubt rooms with socket events:

```javascript
socket.on(SOCKET_EVENTS.JOIN_DOUBT_ROOM, (doubtId) => {
    socket.join(`doubt:${doubtId}`);
});

socket.on(SOCKET_EVENTS.LEAVE_DOUBT_ROOM, (doubtId) => {
    socket.leave(`doubt:${doubtId}`);
});
```

## Events

All events are defined in [server/src/constants/socketEvent.js](../server/src/constants/socketEvent.js).

### Server-to-Client Events

**`new:notification`** — Sent to user or global room when a notification is created

Payload:
```json
{
    "_id": "string",
    "title": "string",
    "message": "string",
    "type": "string",
    "isRead": "boolean",
    "metadata": "object",
    "createdAt": "ISO8601"
}
```

Emitted by: [notification.service.js](../server/src/modules/notification/notification.service.js)

---

**`new:doubt`** — Sent to instructor's private room when a student posts a doubt

Payload:
```json
{
    "_id": "string",
    "title": "string",
    "status": "OPEN|ANSWERED|CLOSED",
    "student": { "_id": "string", "name": "string" },
    "course": "string",
    "lesson": "string",
    "lastReplyAt": "ISO8601"
}
```

Emitted by: [doubt.service.js](../server/src/modules/doubt/doubt.service.js) — `createDoubtService()`

---

**`new:doubt:reply`** — Sent to doubt room (except sender) when a reply is posted

Payload:
```json
{
    "_id": "string",
    "doubt": "string",
    "author": {
        "_id": "string",
        "name": "string",
        "profilePicture": "string|null",
        "role": "STUDENT|INSTRUCTOR|ADMIN"
    },
    "message": "string",
    "createdAt": "ISO8601"
}
```

Emitted by: [doubt.service.js](../server/src/modules/doubt/doubt.service.js) — `replyToDoubtService()`

---

**`doubt:status:updated`** — Sent to doubt room (except sender) when doubt status changes

Payload:
```json
{
    "_id": "string",
    "title": "string",
    "course": { "_id": "string", "title": "string" },
    "lesson": { "_id": "string", "title": "string" },
    "student": { "_id": "string", "name": "string" },
    "status": "ANSWERED|CLOSED",
    "lastReplyAt": "ISO8601"
}
```

Emitted by: [doubt.service.js](../server/src/modules/doubt/doubt.service.js) — `markDoubtAnsweredService()`, `closeDoubtService()`

## Event Emission

Services use the `getIO()` helper to access the socket instance and emit events:

```javascript
import { getIO } from "../../socket/socket.js";

const io = getIO();
```

### Common Patterns

**Send to individual user:**
```javascript
io.to(`user:${userId}`).emit(SOCKET_EVENTS.NEW_NOTIFICATION, data);
```

**Broadcast to global room (excluding user):**
```javascript
io.to("global").except(`user:${userId}`).emit(SOCKET_EVENTS.NEW_NOTIFICATION, data);
```

**Broadcast to doubt room (excluding sender):**
```javascript
io.to(`doubt:${doubtId}`).except(`user:${userId}`).emit(SOCKET_EVENTS.NEW_DOUBT_REPLY, data);
```

## Feature Integration

### Notifications

When a notification is created:
1. Record saved to database
2. Event emitted immediately to recipient via socket
3. Individual notifications → `user:<userId>` room
4. Global notifications → `global` room with user exclusion

Implementations: [notification.service.js](../server/src/modules/notification/notification.service.js)

### Doubt Discussions

Real-time collaboration workflow:

1. **Doubt Posted**: Student creates doubt
   - Database record created
   - `new:doubt` sent to instructor
   - Database notification created for instructor

2. **Reply Posted**: Instructor or student replies
   - Database record created
   - `new:doubt:reply` emitted to `doubt:<doubtId>` room (except sender)
   - Database notification created if student isn't replying

3. **Status Changed**: Instructor marks doubt as answered or student closes doubt
   - Status updated in database
   - `doubt:status:updated` emitted to doubt room (except sender)
   - Database notification created for student

Implementations: [doubt.service.js](../server/src/modules/doubt/doubt.service.js)

## Security

**Authentication**
- Socket connection fails without valid JWT token
- Tokens verified using cryptographic secret
- Expired tokens rejected at handshake

**Authorization**
- Doubt rooms restricted via service-level checks
- Only students, instructors, and admins can access doubt discussions
- Authorization enforced before data is sent

**Data Protection**
- User IDs converted to strings for room operations
- Object IDs validated before socket events
- Sensitive fields excluded from payloads (passwords, tokens)
- Sender excluded from updates via `.except()` to prevent duplicates

## Benefits

| Benefit | Details |
|---------|---------|
| **Real-Time Updates** | Instant notifications and live discussions without polling |
| **Scalability** | Room-based broadcasting reduces unnecessary traffic |
| **User Experience** | No manual refresh required; seamless collaboration |
| **Data Integrity** | All events correspond to database records; authorization verified |
| **Performance** | Efficient WebSocket compared to HTTP polling |

## Implementation Files

- [server/src/socket/socket.js](../server/src/socket/socket.js) — Socket initialization and configuration
- [server/src/constants/socketEvent.js](../server/src/constants/socketEvent.js) — Event constants
- [server/src/modules/notification/notification.service.js](../server/src/modules/notification/notification.service.js) — Notification events
- [server/src/modules/doubt/doubt.service.js](../server/src/modules/doubt/doubt.service.js) — Doubt events
