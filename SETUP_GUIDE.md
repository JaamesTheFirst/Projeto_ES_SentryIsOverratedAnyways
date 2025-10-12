# 🚀 Quick Setup Guide

This guide will help you get the project up and running in minutes.

## ⚡ Quick Start (Docker - Recommended)

The fastest way to get started:

```bash
# 1. Clone the repository
git clone <repository-url>
cd Projeto_ES_SentryIsOverratedAnyways

# 2. Copy environment file
cp env.example .env

# 3. Start everything with Docker
npm run docker:up
```

That's it! 🎉

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000/api
- **Database**: PostgreSQL on port 5432

## 🔧 Manual Setup (Without Docker)

If you prefer to run services locally:

### Step 1: Install Dependencies

```bash
# Install all dependencies at once
npm run install:all

# OR install manually
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Step 2: Start PostgreSQL

Option A - Using Docker for database only:
```bash
docker run -d \
  --name error-management-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -e POSTGRES_DB=error_management \
  -p 5432:5432 \
  postgres:16-alpine
```

Option B - Use your local PostgreSQL installation and update `.env` file accordingly.

### Step 3: Start the Application

```bash
# From the root directory, start both backend and frontend
npm run dev
```

OR start them separately:

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📋 Verification

Once everything is running, verify:

1. **Frontend**: Open http://localhost:5173
   - You should see the welcome page
   - Check the "API Status" card - it should show "API is running!"

2. **Backend**: Visit http://localhost:3000/api/health
   - You should see a JSON response with status "ok"

3. **Database**: Check if PostgreSQL is running
   ```bash
   docker ps  # If using Docker
   # OR
   psql -U admin -d error_management  # If using local PostgreSQL
   ```

## 🐛 Common Issues

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000  # Backend
lsof -i :5173  # Frontend
lsof -i :5432  # PostgreSQL

# Kill the process
kill -9 <PID>
```

### Docker Issues

```bash
# Stop and remove all containers
docker-compose down -v

# Remove unused Docker resources
docker system prune -a

# Rebuild and start
docker-compose up -d --build
```

### Database Connection Failed

1. Check if PostgreSQL is running:
   ```bash
   docker ps | grep postgres
   ```

2. Verify credentials in `.env` file match your PostgreSQL setup

3. Try connecting manually:
   ```bash
   docker exec -it error-management-db psql -U admin -d error_management
   ```

### "Cannot find module" Errors

```bash
# Clean install all dependencies
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all
```

## 📦 What's Included

After setup, your project has:

✅ **Backend (NestJS)**
- TypeScript configured
- PostgreSQL connection ready
- TypeORM for database management
- JWT authentication structure
- Health check endpoint
- CORS enabled
- API validation enabled

✅ **Frontend (React + Vite)**
- TypeScript configured
- React Router for navigation
- Axios with interceptors
- React Query for data fetching
- Modern CSS with CSS Modules
- Responsive design
- API service layer

✅ **Database (PostgreSQL)**
- PostgreSQL 16
- Auto-sync in development
- Ready for TypeORM entities

✅ **Docker Setup**
- Multi-container orchestration
- Hot reload in development
- Network isolation
- Volume persistence

## 🎯 Next Steps

Now that everything is running:

1. **Explore the code structure** - Check out the `README.md` for detailed project structure

2. **Create your first feature**:
   ```bash
   # Backend - Generate a new module
   cd backend
   nest generate module errors
   nest generate controller errors
   nest generate service errors
   
   # Frontend - Create new components
   cd frontend/src/components
   # Add your components here
   ```

3. **Set up your database entities**:
   - Create entities in `backend/src/**/entities/`
   - TypeORM will auto-sync them in development

4. **Build features** - Start implementing:
   - User authentication
   - Error tracking
   - Analytics dashboard
   - Notifications

## 📚 Useful Commands

```bash
# View all running Docker containers
docker ps

# Follow Docker logs
npm run docker:logs

# Stop Docker services
npm run docker:down

# Rebuild Docker images
docker-compose up -d --build

# Access backend container shell
docker exec -it error-management-backend sh

# Access database shell
docker exec -it error-management-db psql -U admin -d error_management
```

## 🆘 Need Help?

- Check the main `README.md` for comprehensive documentation
- Look at the code comments
- Check Docker logs: `npm run docker:logs`
- Open an issue on the repository

---

Happy coding! 🚀

