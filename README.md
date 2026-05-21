# LMS Platform

Fullstack LMS platform with course management, progress tracking, real-time doubt discussion, notifications, and role-based learning features.

---

## Features

* JWT Authentication
* OTP Email Verification
* Role-Based Access Control
* Course, Module & Lesson Management
* Enrollment System
* Progress Tracking
* Review & Rating System
* Real-Time Doubt Discussion
* Real-Time Notifications (Socket.IO)
* Swagger API Documentation
* Modular Backend Architecture

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* JWT Authentication
* Redis

### Documentation

* Swagger/OpenAPI
* Markdown Module Docs

---

## API Documentation

Swagger API documentation is available at:

```bash
/api/v1/docs
```

Includes:

* Interactive API testing
* Request/response schemas
* Authentication docs
* Example payloads

---

## Project Structure

```bash
lms-platform/
├── docs/                 # Module documentation
│
├── server/
│   ├── src/
│   │   ├── config/       # Database, Swagger, Cloudinary configs
│   │   ├── constants/    # App constants and messages
│   │   ├── middlewares/  # Express middlewares
│   │   ├── modules/      # Feature-based modules
│   │   ├── socket/       # Socket.IO setup and events
│   │   ├── utils/        # Utility/helper functions
│   │   ├── app.js        # Express app setup
│   │   └── server.js     # Server entry point
│   │
│   ├── .env
│   ├── .env.example
│   └── package.json 
│
└── README.md
```

---

## Installation

```bash
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server/` directory.

A sample environment file is already included:

```bash
.env.example
```

Copy it:

```bash
cp .env.example .env
```

Then update the values with your local configuration.

---

## Run Development Server

```bash
npm run dev
```

---

## Documentation

Additional module documentation is available in the `docs/` directory.

Includes:

* auth.md
* user.md
* course.md
* module.md
* lesson.md
* enrollment.md
* progress.md
* review.md
* doubt.md
* notification.md
* socket.md

---

## Realtime Features

Socket.IO powers:

* Real-time notifications
* Real-time doubt replies
* Real-time doubt status updates

Detailed realtime documentation is available in:

```bash
docs/socket.md
```

---

## Author

Sk Hasanur Ali