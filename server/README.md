# Chat App Backend

A secure, production-ready Express backend for a chat application with JWT authentication, Supabase PostgreSQL database, and Google Gemini AI integration.

## Features

- 🔐 **Secure Authentication**: JWT-based auth with bcrypt password hashing
- 💬 **AI-Powered Chat**: Integration with Google Gemini 2.0 Flash for intelligent responses
- 📊 **Data Persistence**: PostgreSQL database via Supabase
- 🛡️ **Security**: Rate limiting, input validation, CORS protection
- 🐳 **Docker Ready**: Multi-stage Dockerfile for optimized deployment
- 📝 **TypeScript**: Full type safety and modern JavaScript features

## Architecture

```
React Client
   ↓ JWT
Express Backend
   ├── Auth (JWT + bcrypt)
   ├── Chat APIs
   ├── AI Orchestration (Gemini)
   └── Database (Supabase PostgreSQL)
```

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 2.0 Flash
- **Auth**: JWT + bcrypt
- **Validation**: express-validator
- **Rate Limiting**: express-rate-limit

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration (env, supabase, gemini)
│   ├── middleware/      # Auth, validation, rate limiting, error handling
│   ├── routes/          # API routes
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic (auth, chat, AI)
│   ├── utils/           # Utilities (logger)
│   └── types/           # TypeScript type definitions
├── database/
│   └── schema.sql       # Database schema
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- Google AI Studio API key

### Installation

1. **Clone and navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file**:
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   GEMINI_API_KEY=your-gemini-api-key
   ```

5. **Set up Supabase database**:
   - Create a new Supabase project
   - Run the SQL schema from `database/schema.sql` in the Supabase SQL editor
   - Copy your project URL and service role key to `.env`

6. **Get Gemini API key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key
   - Add it to `.env`

### Running the Server

**Development mode**:
```bash
npm run dev
```

**Production build**:
```bash
npm run build
npm start
```

**Docker**:
```bash
docker-compose up --build
```

## API Endpoints

### Authentication

#### POST `/auth/signup`
Register a new user.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!@#"
}
```

**Response** (201):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

#### POST `/auth/login`
Authenticate and get JWT token.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!@#"
}
```

**Response** (200):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### Chat (Protected Routes)

All chat endpoints require `Authorization: Bearer <token>` header.

#### POST `/chat/send`
Send a message and get AI response.

**Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Request**:
```json
{
  "message": "Hello, how can you help me?"
}
```

**Response** (200):
```json
{
  "message": "Hello! I'm here to assist you...",
  "role": "assistant",
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

**Rate Limit**: 20 requests per minute

#### GET `/chat/history`
Get chat history for authenticated user.

**Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Query Parameters**:
- `limit` (optional): Number of messages to return (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response** (200):
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello",
      "timestamp": "2024-01-15T12:00:00.000Z"
    },
    {
      "role": "assistant",
      "content": "Hi there!",
      "timestamp": "2024-01-15T12:00:01.000Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "count": 2
  }
}
```

#### DELETE `/chat/history`
Delete all chat history for authenticated user.

**Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Response** (200):
```json
{
  "message": "Chat history deleted successfully"
}
```

### Health Check

#### GET `/health`
Check server status.

**Response** (200):
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "uptime": 12345.67
}
```

## Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: 7-day expiration (configurable)
- **Rate Limiting**: 
  - Chat endpoints: 20 requests/minute per user
  - General API: 100 requests/minute per IP
- **Input Validation**: express-validator for all inputs
- **CORS**: Configurable origin restrictions
- **Error Handling**: No sensitive data leakage
- **SQL Injection Protection**: Supabase parameterized queries

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment (development/production) | No (default: development) |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | No (default: 7d) |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `CORS_ORIGIN` | Allowed CORS origins | No (default: *) |

## Database Schema

### Users Table
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- bcrypt hashed
  created_at TIMESTAMP
)
```

### Messages Table
```sql
messages (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  role VARCHAR(20) CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP
)
```

## Deployment

### Docker Deployment

1. **Build and run with docker-compose**:
   ```bash
   docker-compose up -d
   ```

2. **View logs**:
   ```bash
   docker-compose logs -f
   ```

3. **Stop**:
   ```bash
   docker-compose down
   ```

### Production Considerations

- Set `NODE_ENV=production`
- Use a strong `JWT_SECRET` (generate with `openssl rand -base64 32`)
- Configure `CORS_ORIGIN` to your frontend domain
- Set up SSL/TLS (use reverse proxy like nginx)
- Monitor logs and set up error tracking
- Configure database backups in Supabase
- Set up health check monitoring

## Development

### Type Checking
```bash
npm run type-check
```

### Code Structure

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and external integrations
- **Middleware**: Request processing (auth, validation, etc.)
- **Routes**: API endpoint definitions
- **Config**: Environment and third-party service setup

## Troubleshooting

### Common Issues

1. **"Missing required environment variables"**
   - Ensure all required variables are set in `.env`
   - Check `.env.example` for reference

2. **"Failed to create user account"**
   - Verify Supabase connection
   - Check database schema is properly set up
   - Ensure service role key has proper permissions

3. **"Failed to generate AI response"**
   - Verify Gemini API key is valid
   - Check API quota limits
   - Review error logs for specific issues

4. **JWT token errors**
   - Ensure `JWT_SECRET` is set and consistent
   - Check token hasn't expired
   - Verify `Authorization` header format: `Bearer <token>`

## License

MIT

## Support

For issues and questions, please open an issue on the repository.
