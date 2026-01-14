# Node.js Express TypeScript Boilerplate (2025/2026)

A complete, modern, production-ready boilerplate for building high-scale REST APIs.

## Features
- 🚀 **Node.js 20+** with pure ESM
- 🛡️ **TypeScript 5.5+** (Strict mode)
- 🏗️ **Clean Architecture** (Controllers, Services, Models)
- 🔐 **JWT Auth** with Refresh Token rotation (Redis-backed)
- 🚦 **RBAC** (Role Based Access Control)
- ✅ **Validation** with Zod
- 📦 **File Storage** (S3 / MinIO support)
- 📖 **API Docs** (Swagger/OpenAPI)
- 🛡️ **Security** (Helmet, CORS, Rate Limiting)
- 📝 **Structured Logging** (Pino)
- 🧪 **Testing** (Jest + Supertest + MongoMemoryServer)
- 🐳 **Docker & PM2** ready

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Redis (Optional if running locally without Docker)
- MongoDB (Optional if running locally without Docker)

### Installation
1. Clone the repo
2. Copy `.env.example` to `.env`
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
```bash
# Start infrastructure (Mongo, Redis, MinIO)
npm run docker:up

# Start dev server
npm run dev
```

### Testing
```bash
npm run test
```

### Documentation
API documentation is available at `http://localhost:3000/api-docs` when the server is running.

## Project Structure
```text
src/
├── config/         # Config loader, DB connection, S3/Redis clients
├── controllers/    # Request handlers
├── interfaces/     # TypeScript interfaces/types
├── middlewares/    # Custom middlewares (auth, validation, error)
├── models/         # Mongoose models
├── routes/         # API routes
├── services/       # Business logic
└── utils/          # Helpers (ApiResponse, ApiError, logger)
```

## Production Readiness
- **Docker**: Multi-stage Dockerfile for optimized images.
- **PM2**: Ecosystem file for cluster mode.
- **Graceful Shutdown**: Handles SIGTERM/SIGINT.
- **Health Checks**: `/api/v1/health` endpoint.
