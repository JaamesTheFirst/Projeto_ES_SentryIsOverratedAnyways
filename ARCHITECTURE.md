# 🏗️ Architecture Overview

This document provides an overview of the system architecture for the Error Management Platform.

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│                     (React + TypeScript)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST
                         │ Port 5173
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (Vite)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Pages      │  │  Components  │  │   Services   │         │
│  │  - HomePage  │  │  - (Future)  │  │  - API       │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST API
                         │ Port 3000
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (NestJS)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Controllers  │  │   Services   │  │   Entities   │         │
│  │  - App       │  │  - App       │  │  - Base      │         │
│  │  - (Future)  │  │  - (Future)  │  │  - (Future)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                         │                                        │
│                         │ TypeORM                                │
└─────────────────────────┼────────────────────────────────────────┘
                          │ PostgreSQL Protocol
                          │ Port 5432
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                           │
│                       (Version 16)                              │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Technology Stack

### Frontend Layer
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Language**: TypeScript 5.3
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Styling**: CSS Modules

### Backend Layer
- **Framework**: NestJS 10.3
- **Language**: TypeScript 5.3
- **Runtime**: Node.js 20
- **ORM**: TypeORM 0.3
- **Authentication**: Passport + JWT (configured)
- **Validation**: class-validator + class-transformer

### Database Layer
- **Database**: PostgreSQL 16
- **Connection**: TypeORM
- **Migration**: Auto-sync in development

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Development**: Hot reload enabled for both frontend and backend

## 📊 Data Flow

### Request Flow (Frontend → Backend → Database)

```
1. User Action (Browser)
   ↓
2. React Component
   ↓
3. API Service (Axios)
   ↓
4. HTTP Request → Backend API
   ↓
5. NestJS Controller
   ↓
6. Service Layer (Business Logic)
   ↓
7. TypeORM Repository
   ↓
8. PostgreSQL Database
   ↓
9. Response ← Back through the chain
```

### Authentication Flow (Planned)

```
1. User Login Request
   ↓
2. Backend validates credentials
   ↓
3. Generate JWT token
   ↓
4. Return token to frontend
   ↓
5. Store in localStorage
   ↓
6. Include in subsequent requests (Authorization header)
   ↓
7. Backend validates token on each request
```

## 🔐 Security Layers

### Frontend
- **XSS Protection**: React's built-in escaping
- **HTTPS**: (To be configured in production)
- **Token Storage**: localStorage (with httpOnly consideration for production)
- **CORS**: Configured in backend

### Backend
- **CORS**: Enabled with origin whitelist
- **Validation**: Global validation pipe
- **Authentication**: JWT strategy (structure in place)
- **Rate Limiting**: (To be implemented)
- **Helmet**: (To be added for security headers)

### Database
- **Connection**: Through environment variables
- **SQL Injection**: Protected by TypeORM parameterized queries
- **Encryption**: TLS connection (to be configured in production)

## 📁 Module Structure

### Backend Modules (NestJS)

```
backend/src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
├── common/
│   └── entities/
│       └── base.entity.ts # Base entity with common fields
└── [future modules]/
    ├── errors/            # Error tracking module
    ├── projects/          # Project management
    ├── users/             # User management
    └── auth/              # Authentication
```

### Frontend Structure (React)

```
frontend/src/
├── main.tsx              # Application entry point
├── App.tsx               # Root component with routing
├── pages/
│   └── HomePage.tsx      # Landing page
├── services/
│   └── api.ts            # Axios instance & interceptors
├── components/           # Reusable components (future)
├── hooks/                # Custom React hooks (future)
├── types/                # TypeScript types (future)
└── utils/                # Utility functions (future)
```

## 🐳 Docker Architecture

### Services

1. **PostgreSQL Container**
   - Image: `postgres:16-alpine`
   - Port: 5432
   - Volume: `postgres-data` (persistent)
   - Health check: Enabled

2. **Backend Container**
   - Base: `node:20-alpine`
   - Port: 3000
   - Volume: Hot reload enabled
   - Depends on: PostgreSQL

3. **Frontend Container**
   - Base: `node:20-alpine`
   - Port: 5173
   - Volume: Hot reload enabled
   - Depends on: Backend

### Network
- All services on `error-management-network`
- Bridge driver for isolation
- Services communicate via service names

## 🔄 Development Workflow

### Local Development (Without Docker)

```
1. Developer writes code
   ↓
2. Hot reload detects changes
   ↓
3. TypeScript compiles
   ↓
4. Application updates
   ↓
5. Browser auto-refreshes (Vite HMR)
```

### Docker Development

```
1. Developer writes code
   ↓
2. Volume mount syncs to container
   ↓
3. Container's hot reload triggers
   ↓
4. Application updates in container
   ↓
5. Browser refreshes
```

## 🚀 Deployment Architecture (Planned)

### Production Environment

```
┌──────────────────────────────────────┐
│          Load Balancer               │
│         (NGINX/CloudFlare)           │
└──────────────┬───────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│  Frontend   │  │   Backend   │
│  (Static)   │  │  (Cluster)  │
│   CDN/S3    │  │   Docker    │
└─────────────┘  └──────┬──────┘
                        │
                        ▼
                 ┌─────────────┐
                 │  PostgreSQL │
                 │  (Managed)  │
                 └─────────────┘
```

## 🎯 Design Patterns

### Backend Patterns

1. **Module Pattern**: NestJS modules for separation of concerns
2. **Dependency Injection**: NestJS built-in DI container
3. **Repository Pattern**: TypeORM repositories
4. **DTOs**: Data Transfer Objects for validation
5. **Guards**: Authentication/Authorization (to be implemented)
6. **Interceptors**: Request/Response transformation (to be implemented)
7. **Pipes**: Validation and transformation

### Frontend Patterns

1. **Component Composition**: React component hierarchy
2. **Custom Hooks**: Reusable logic (to be expanded)
3. **Service Layer**: API communication abstraction
4. **Container/Presenter**: Separation of logic and presentation
5. **Context API**: Global state (to be implemented as needed)
6. **React Query**: Server state management

## 📈 Scalability Considerations

### Current Architecture
- Suitable for: Development, small to medium projects
- Users: Up to ~1000 concurrent users
- Data: Moderate data volumes

### Future Scalability Options
1. **Horizontal Scaling**: Add more backend instances behind load balancer
2. **Database Scaling**: Read replicas, connection pooling
3. **Caching**: Redis for sessions and frequently accessed data
4. **CDN**: Static assets delivery
5. **Microservices**: Split into smaller services if needed
6. **Message Queue**: RabbitMQ/Redis for async processing

## 🔍 Monitoring & Observability (To Be Implemented)

1. **Application Logs**: Structured logging (Winston/Pino)
2. **Error Tracking**: The app itself will track errors!
3. **Performance Monitoring**: Response times, throughput
4. **Health Checks**: Already implemented for API
5. **Database Monitoring**: Query performance, connection pool

## 📝 API Design

### REST Principles
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Status codes (200, 201, 400, 401, 404, 500)
- JSON request/response format

### API Versioning (Planned)
```
/api/v1/errors
/api/v1/projects
/api/v1/users
```

### Authentication
```
Authorization: Bearer <JWT_TOKEN>
```

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: Jest for services and utilities
- **Integration Tests**: Test database interactions
- **E2E Tests**: Supertest for API endpoints

### Frontend Testing
- **Unit Tests**: Vitest for components and hooks
- **Integration Tests**: Testing Library
- **E2E Tests**: Playwright/Cypress (to be added)

## 📚 Further Reading

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [TypeORM Documentation](https://typeorm.io/)
- [Vite Documentation](https://vitejs.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

This architecture is designed to be:
- ✅ Scalable
- ✅ Maintainable
- ✅ Type-safe (TypeScript throughout)
- ✅ Modern (Latest technologies)
- ✅ Developer-friendly (Hot reload, clear structure)
- ✅ Production-ready (with proper configuration)

