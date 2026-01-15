

# AI Chat Application – Full-Stack Assignment

This repository contains a **full-stack AI chat application** developed as part of a **technical assignment**.
The goal of the assignment is to demonstrate **system design, secure backend architecture, AI integration, containerization, and frontend implementation** using modern web technologies.

The application enables authenticated users to interact with an AI assistant, while securely storing chat history and abstracting AI providers behind a clean backend interface.

---

## Assignment Objectives

* Build a **secure, production-style full-stack application**
* Implement **JWT-based authentication**
* Integrate **LLM providers** (OpenAI / OpenRouter)
* Persist user-scoped chat history in a relational database
* Demonstrate **clean architecture and separation of concerns**
* Ensure frontend does **not** directly access secrets, DB, or AI providers
* Provide **containerized local setup** using Docker

---

## Key Features

### Modern Frontend

* Next.js App Router
* Responsive chat UI
* Auth-guarded routes
* Clean state management

### Secure Backend

* Custom JWT authentication
* Password hashing with bcrypt
* Protected APIs
* Rate-limit ready

### AI Integration

* OpenAI-compatible SDK
* Supports OpenAI & OpenRouter
* Provider switching via environment variables
* Backend-only AI orchestration

### Database

* Supabase (PostgreSQL)
* User-scoped chat persistence
* Relational schema

### DevOps

* Dockerized frontend & backend
* Local orchestration via Docker Compose
* Cloud deployment on free-tier platforms

---

## Tech Stack

### Frontend (`/client`)

* **Framework**: Next.js (App Router)
* **Library**: React 19
* **Styling**: Tailwind CSS
* **Language**: TypeScript

### Backend (`/server`)

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: Supabase (PostgreSQL)
* **Authentication**: JWT + bcrypt
* **AI Client**: OpenAI SDK (used for both OpenAI & OpenRouter)

---

## Installation & Setup

### Prerequisites

* Node.js (v20+)
* npm / yarn
* Supabase project
* API key for OpenAI or OpenRouter
* Docker & Docker Compose (optional, recommended)

---

## 1️ Backend Setup (Local)

```bash
cd server
npm install
```

Create `.env` from `.env.example`:

```env
PORT=3000
NODE_ENV=development

JWT_SECRET=your_secure_jwt_secret

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Configuration
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# OR OpenRouter
# LLM_PROVIDER=openrouter
# OPENROUTER_API_KEY=sk-or-...
```

Run the database schema in Supabase:

```
src/db/schema.sql
```

Start the backend:

```bash
npm run dev
```

---

## 2️ Frontend Setup (Local)

```bash
cd client
npm install
npm run dev
```

Access the app at:

```
http://localhost:3001
```

---

## Docker Setup (Local – Recommended)

The application is fully containerized and can be run locally using Docker Compose.

### Build & Run

From the project root:

```bash
docker compose up --build
```

### Services

* **Frontend** → `http://localhost:3001`
* **Backend** → `http://localhost:3000`
* **Database** → Supabase (hosted)

### Notes

* Supabase remains hosted (not containerized)
* Environment variables are injected at runtime
* Containers are stateless and production-aligned

---

## Project Structure

```
├── client/                 # Next.js frontend
│   ├── app/                # App Router pages
│   ├── components/         # UI & feature components
│   ├── context/            # Auth & Chat context
│   └── services/           # API services
│
└── server/                 # Express backend
    ├── src/
    │   ├── config/         # Environment & clients
    │   ├── controllers/    # Request handlers
    │   ├── db/             # Schema & DB access
    │   ├── middlewares/    # Auth middleware
    │   ├── routes/         # API routes
    │   ├── services/       # AI abstraction
    │   └── utils/          # Helpers
    ├── Dockerfile
    └── .env.example
```

---

## Architecture Overview

The application follows a **secure 3-tier architecture**.

```
User
 ↓
Next.js Client
 ↓ (JWT)
Express Backend
 ├─ Auth (JWT + bcrypt)
 ├─ Chat APIs
 ├─ AI Orchestration
 ↓
Supabase (PostgreSQL)
 ↓
LLM Provider (OpenAI / OpenRouter)
```

### Key Constraints

* Frontend **never** talks to Supabase directly
* Frontend **never** accesses AI keys
* All sensitive logic is backend-owned

---

## Key Architectural Decisions

### Backend-Controlled Authentication

* Supabase is used **only as a database**
* Authentication logic lives in Express
* Backend issues and validates JWTs
* Full control over sessions and expiry

### AI Provider Abstraction

* AI logic centralized in a service layer
* OpenAI & OpenRouter are interchangeable
* Provider switching via environment variables

### User-Scoped Data Isolation

* Each message is associated with a user
* Queries filtered by authenticated `userId`
* Prevents cross-user data leakage

---

## Security Considerations

* Passwords hashed with bcrypt
* JWT expiration enforced
* Backend-only Supabase service role access
* No secrets exposed to the client
* Rate limiting supported on AI endpoints

---

## Deployment

### Frontend

* **Platform**: Vercel
* **Reason**: Native Next.js support, edge-optimized builds
* **Deployment**: Automatic via GitHub integration

### Backend

* **Platform**: Render
* **Reason**: Simple Docker-based deployment, free tier support
* **Deployment**: Containerized Express API

### Database

* **Platform**: Supabase (Hosted PostgreSQL)

---

## Notes for Reviewers

* This project is built strictly as a **technical assignment**
* Focus areas:

  * Architecture clarity
  * Security boundaries
  * Backend ownership
  * Real-world deployment readiness
* UI polish is intentionally secondary to correctness and design

---

## Summary

This assignment demonstrates:

* End-to-end full-stack ownership
* Secure, production-style backend
* Practical AI integration
* Docker-based development
* Clean separation of concerns
* Real-world deployment strategy

---
