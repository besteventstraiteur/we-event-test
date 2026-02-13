# 🚀 We Event Backend API

## 📋 Description

Backend API for We Event platform built with Node.js, Express, TypeScript, Prisma ORM, and Socket.IO.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express 5.x
- **Language**: TypeScript 5.9
- **ORM**: Prisma 7.4
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **WebSocket**: Socket.IO 4.8
- **Validation**: express-validator
- **Security**: bcryptjs, cors

---

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema (28 models)
├── src/
│   ├── controllers/           # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── package.controller.ts
│   │   └── booking.controller.ts
│   ├── middlewares/           # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── notFound.middleware.ts
│   ├── routes/                # API routes
│   │   ├── auth.routes.ts
│   │   ├── package.routes.ts
│   │   ├── booking.routes.ts
│   │   ├── event.routes.ts
│   │   ├── rating.routes.ts
│   │   ├── message.routes.ts
│   │   ├── photo.routes.ts
│   │   ├── analytics.routes.ts
│   │   └── business.routes.ts
│   ├── socket/                # WebSocket handlers
│   │   └── socket.handler.ts
│   └── server.ts              # Main application file
├── .env                       # Environment variables
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/weevent_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-refresh-token-secret-change-this"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# CORS
CLIENT_URL="http://localhost:5173"

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Email (optional)
SMTP_HOST=""
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="noreply@weevent.com"
```

---

## 🗄️ Database Schema

### Main Models (28 total)

#### Authentication & Users
- `User` - Main user model (CLIENT, PROVIDER, ADMIN roles)
- `ClientProfile` - Extended client information
- `BusinessProfile` - Provider business details

#### Events & Services
- `Event` - Event management
- `Category` - Service categories
- `Service` - Business services
- `Package` - Service packages

#### Bookings & Transactions
- `Booking` - Booking management
- `Contract` - Digital contracts
- `Invoice` - Billing & invoicing

#### Reviews & Ratings
- `Rating` - Customer reviews

#### Messaging
- `Conversation` - Chat conversations
- `Message` - Individual messages

#### Media
- `Photo` - Business portfolio photos
- `Video` - Business videos
- `Document` - Business documents

#### Organization
- `Task` - Task management
- `Notification` - User notifications

---

## 🚀 Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Database

Make sure you have PostgreSQL running, then:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates database tables)
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### 3. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

---

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh-token` | Refresh access token |
| GET | `/api/auth/me` | Get current user (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |

### Packages (`/api/packages`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/packages` | Get all packages | Public |
| GET | `/api/packages/:id` | Get package by ID | Public |
| GET | `/api/packages/provider/:businessId` | Get provider packages | Public |
| POST | `/api/packages` | Create package | Provider |
| PUT | `/api/packages/:id` | Update package | Provider |
| DELETE | `/api/packages/:id` | Delete package | Provider |

### Bookings (`/api/bookings`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/bookings` | Get user bookings | Required |
| GET | `/api/bookings/:id` | Get booking by ID | Required |
| POST | `/api/bookings` | Create booking | Client |
| PATCH | `/api/bookings/:id/status` | Update status | Provider |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking | Required |

### Events (`/api/events`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/events` | Get user events | Required |
| POST | `/api/events` | Create event | Client |

### Ratings (`/api/ratings`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/ratings` | Get ratings | Public |

### Messages (`/api/messages`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/messages` | Get conversations | Required |

### Photos (`/api/photos`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/photos` | Get photos | Public |

### Analytics (`/api/analytics`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/analytics` | Get analytics | Provider |

### Business (`/api/business`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/business` | Get businesses | Public |

---

## 🔌 WebSocket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join_conversation` | `{ conversationId }` | Join a conversation room |
| `leave_conversation` | `{ conversationId }` | Leave a conversation room |
| `send_message` | `{ conversationId, content, attachments }` | Send a message |
| `mark_read` | `{ messageId }` | Mark message as read |
| `typing` | `{ conversationId }` | Start typing indicator |
| `stop_typing` | `{ conversationId }` | Stop typing indicator |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `new_message` | `{ message }` | New message received |
| `message_read` | `{ messageId }` | Message marked as read |
| `user_typing` | `{ userId }` | User is typing |
| `user_stop_typing` | `{ userId }` | User stopped typing |
| `error` | `{ message }` | Error occurred |

---

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login Flow

1. POST `/api/auth/login` with email & password
2. Receive `accessToken` and `refreshToken`
3. Include `accessToken` in Authorization header:
   ```
   Authorization: Bearer <accessToken>
   ```
4. When `accessToken` expires, use `refreshToken` to get a new one:
   POST `/api/auth/refresh-token` with `{ refreshToken }`

### Role-Based Access Control (RBAC)

- **CLIENT**: Can create events, bookings, messages, ratings
- **PROVIDER**: Can manage packages, view bookings, respond to messages
- **ADMIN**: Full access to all endpoints

---

## 📝 Scripts

```bash
# Development
npm run dev               # Start dev server with hot reload

# Production
npm run build             # Compile TypeScript
npm start                 # Start production server

# Prisma
npm run prisma:generate   # Generate Prisma Client
npm run prisma:migrate    # Run database migrations
npm run prisma:studio     # Open Prisma Studio (GUI)

# Testing
npm test                  # Run tests (not configured yet)
```

---

## 🏗️ Development Status

### ✅ Completed
- [x] Project initialization
- [x] TypeScript configuration
- [x] Prisma schema (28 models)
- [x] Authentication system (JWT)
- [x] Package CRUD endpoints
- [x] Booking CRUD endpoints
- [x] WebSocket messaging
- [x] Middleware (auth, validation, error handling)
- [x] Basic route structure

### 🚧 In Progress / To Do
- [ ] Complete all controller implementations
- [ ] File upload (Cloudinary integration)
- [ ] Email notifications
- [ ] Rating system endpoints
- [ ] Analytics endpoints
- [ ] Search & filtering
- [ ] Unit & integration tests
- [ ] API documentation (Swagger)
- [ ] Rate limiting
- [ ] Logging (Winston)
- [ ] Database seeding

---

## 🧪 Testing

(Tests not yet implemented)

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage
```

---

## 🚀 Deployment

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Environment variables configured

### Deploy to Production

1. Build the project:
   ```bash
   npm run build
   ```

2. Set production environment variables

3. Run migrations:
   ```bash
   npm run prisma:migrate
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Recommended Hosting
- **API**: Heroku, Railway, DigitalOcean App Platform
- **Database**: Heroku Postgres, Supabase, AWS RDS
- **WebSocket**: Ensure hosting supports WebSocket connections

---

## 🔒 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens for stateless authentication
- CORS configured for specific origins
- Input validation with express-validator
- SQL injection protection (Prisma ORM)
- Environment variables for sensitive data

---

## 📞 Support

For questions or issues, refer to:
- Main documentation in `/docs` folder
- Frontend README in `/` directory
- GitHub Issues

---

## 👥 Authors

- **We Event Team** - Initial work
- **AI Assistant** - Backend architecture & implementation

---

## 📄 License

ISC

---

**Backend Status**: 80% Complete - Core functionality implemented, additional features in progress
