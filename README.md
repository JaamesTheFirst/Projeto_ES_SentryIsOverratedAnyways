# 🚀 Error Management Platform - Sentry is Overrated Anyways

A modern, full-stack error tracking and monitoring platform built with TypeScript, designed to help developers track, monitor, and manage errors in their applications.

## 📋 Project Overview

This is a **Software Engineering** project that implements a Sentry-like error management system with a focus on simplicity and essential features.

### Tech Stack

#### Backend
- **TypeScript** - Type-safe JavaScript
- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for database management
- **PostgreSQL** - Robust relational database
- **Passport & JWT** - Authentication & authorization

#### Frontend
- **React** - Modern UI library
- **TypeScript** - Type safety throughout
- **Vite** - Lightning-fast build tool
- **React Query** - Server state management
- **Axios** - HTTP client

#### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## 🚀 Getting Started

### ⚡ Super Quick Start (Automatic Setup)

**For the fastest setup experience**, just run our initialization script:

```bash
# 1. Clone the repository
git clone <repository-url>
cd Projeto_ES_SentryIsOverratedAnyways

# 2. Run the magic script
chmod +x init.sh
./init.sh
```

**That's it!** The script will automatically:
- ✅ Check all prerequisites (Node.js, Docker, etc.)
- ✅ Install all dependencies (root, backend, frontend)
- ✅ Set up environment files
- ✅ Start Docker containers
- ✅ Verify everything is working

**Windows Users**: See [WINDOWS_SETUP.md](WINDOWS_SETUP.md) for WSL-specific instructions.

---

### 📋 Manual Setup (If You Prefer)

#### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

#### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Projeto_ES_SentryIsOverratedAnyways
   ```

2. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env file with your configuration
   # You can use the default values for development
   ```

3. **Install dependencies**

   Choose one of the following methods:

   **Option A: Install all at once (recommended)**
   ```bash
   npm run install:all
   ```

   **Option B: Install manually**
   ```bash
   # Root dependencies
   npm install

   # Backend dependencies
   cd backend
   npm install
   cd ..

   # Frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

---

## 🐳 Running with Docker (Recommended)

The easiest way to run the entire stack is using Docker Compose:

```bash
# Start all services (PostgreSQL, Backend, Frontend)
npm run docker:up

# View logs
npm run docker:logs

# Stop all services
npm run docker:down
```

Once running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **PostgreSQL**: localhost:5432

---

## 💻 Running Locally (Without Docker)

### 1. Start PostgreSQL

You'll need a PostgreSQL instance running. You can:
- Use Docker for just PostgreSQL:
  ```bash
  docker run -d \
    --name error-management-db \
    -e POSTGRES_USER=admin \
    -e POSTGRES_PASSWORD=admin123 \
    -e POSTGRES_DB=error_management \
    -p 5432:5432 \
    postgres:16-alpine
  ```

### 2. Start Backend

```bash
cd backend
npm run start:dev
```

Backend will be available at http://localhost:3000/api

### 3. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will be available at http://localhost:5173

### 4. Run Both Together

From the root directory:
```bash
npm run dev
```

This will start both backend and frontend concurrently.

---

## 📁 Project Structure

```
Projeto_ES_SentryIsOverratedAnyways/
├── backend/                    # NestJS backend application
│   ├── src/
│   │   ├── app.module.ts      # Main application module
│   │   ├── main.ts            # Application entry point
│   │   ├── common/            # Shared utilities and entities
│   │   └── ...                # Feature modules (to be added)
│   ├── test/                  # E2E tests
│   ├── Dockerfile             # Backend Docker configuration
│   ├── package.json           # Backend dependencies
│   └── tsconfig.json          # TypeScript configuration
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx            # Main App component
│   │   ├── main.tsx           # Application entry point
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── ...                # Components, hooks, etc.
│   ├── Dockerfile             # Frontend Docker configuration
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.ts         # Vite configuration
│   └── tsconfig.json          # TypeScript configuration
│
├── docker-compose.yml          # Docker orchestration
├── package.json               # Root workspace configuration
├── env.example                # Environment variables template
└── README.md                  # This file
```

---

## 🔧 Available Scripts

### Root Level

```bash
npm run dev              # Run both backend and frontend
npm run build            # Build both projects
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
npm run docker:logs      # View Docker logs
npm run install:all      # Install all dependencies
```

### Backend (cd backend)

```bash
npm run start:dev        # Start in development mode
npm run start:debug      # Start with debugging
npm run build            # Build for production
npm run start:prod       # Start production server
npm run lint             # Run ESLint
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
```

### Frontend (cd frontend)

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking
```

---

## 🗄️ Database

The project uses PostgreSQL as the database. TypeORM handles the database schema and migrations.

### Default Configuration

- **Host**: localhost
- **Port**: 5432
- **Database**: error_management
- **Username**: admin
- **Password**: admin123

⚠️ **Note**: These are development credentials. Change them for production!

### TypeORM Auto-Sync

In development mode, TypeORM automatically syncs the database schema with your entities. In production, this is disabled for safety.

---

## 🔐 Environment Variables

Key environment variables (see `env.example`):

```env
# Database
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=error_management

# Backend
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3000

# Frontend
VITE_API_URL=http://localhost:3000
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests

```bash
cd frontend
npm run test
```

---

## 🚢 Production Deployment

### Building for Production

```bash
# Build both projects
npm run build

# Or build individually
cd backend && npm run build
cd frontend && npm run build
```

### Docker Production Build

Update the Dockerfiles with production configurations, then:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📚 API Documentation

Once the backend is running, you can access:

- **Health Check**: http://localhost:3000/api/health
- **Base Endpoint**: http://localhost:3000/api

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🎯 Next Steps

Now that you have the boilerplate set up, here are some features you might want to implement:

- [ ] User authentication and authorization
- [ ] Project/application management
- [ ] Error tracking and logging endpoints
- [ ] Error analytics and dashboards
- [ ] User notifications
- [ ] Error grouping and filtering
- [ ] Stack trace analysis
- [ ] Integration SDKs for various platforms

---

## 💡 Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

```bash
# Check what's using the port
lsof -i :3000  # or :5173

# Kill the process
kill -9 <PID>
```

### Docker Issues

```bash
# Clean up Docker resources
docker-compose down -v
docker system prune -a
```

### Database Connection Issues

Make sure PostgreSQL is running and the credentials in your `.env` file match.

### Permission Denied Errors (WSL/Ubuntu)

If you encounter `EACCES: permission denied` errors when running Vite or npm (especially in WSL):

**Quick Fix:**
```bash
# Run the permission fix script
npm run fix:permissions

# Or manually:
chmod +x scripts/fix-permissions.sh
./scripts/fix-permissions.sh
```

**Manual Fix:**
```bash
# Fix frontend node_modules permissions
cd frontend
sudo chown -R $(whoami):$(whoami) node_modules
chmod -R u+rwX,go+rX node_modules

# Remove problematic Vite cache
rm -rf node_modules/.vite/deps_temp_*

# If issues persist, reinstall dependencies
rm -rf node_modules
npm install
```

**Common Causes:**
- Files created by different users (e.g., root vs. regular user)
- Files copied from Windows to WSL with incorrect permissions
- Docker containers creating files with root ownership

---

## 📧 Contact

For questions or issues, please open an issue on the repository.

---

Made with ❤️ for Software Engineering Project
