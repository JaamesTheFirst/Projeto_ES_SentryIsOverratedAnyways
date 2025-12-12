# 🧪 Backend API Testing Guide

## Quick Start

### Option 1: Docker (Recommended - Everything automated)

```bash
# Make sure you're in the project root
cd Projeto_ES_SentryIsOverratedAnyways

# Start all services (PostgreSQL + Backend)
docker-compose up postgres backend

# Or start just the database if you want to run backend locally
docker-compose up postgres
```

### Option 2: Local Development

```bash
# 1. Start PostgreSQL (if not using Docker)
# Use Docker for just PostgreSQL:
docker run -d \
  --name error-management-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -e POSTGRES_DB=error_management \
  -p 5432:5432 \
  postgres:16-alpine

# 2. Create .env file in backend/ (if doesn't exist)
cd backend
cp ../env.example .env

# 3. Install dependencies (if not done)
npm install

# 4. Start backend
npm run start:dev
```

The backend will be available at: **http://localhost:3000/api**

---

## 🧪 Testing the API

### Using cURL (Command Line)

#### 1. Health Check (No auth required)
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "service": "error-management-backend"
}
```

---

#### 2. Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Expected response:
```json
{
  "id": "uuid-here",
  "email": "test@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "createdAt": "2024-01-01T12:00:00.000Z",
  ...
}
```

---

#### 3. Login (Get JWT Token)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    ...
  }
}
```

**Save the `access_token` - you'll need it for authenticated requests!**

---

#### 4. Get Your Profile (Requires JWT)
```bash
# Replace YOUR_TOKEN with the access_token from login
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### 5. Create a Project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Web App",
    "description": "My awesome web application",
    "icon": "🌐"
  }'
```

Expected response includes `apiKey` - **save this for SDK testing!**
```json
{
  "id": "uuid-here",
  "name": "My Web App",
  "apiKey": "err_abc123...",
  "status": "active",
  ...
}
```

---

#### 6. List Your Projects
```bash
curl http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### 7. Report an Error (SDK Endpoint - Uses API Key)
```bash
# Replace API_KEY with the apiKey from project creation
curl -X POST http://localhost:3000/api/errors/report \
  -H "Authorization: Bearer API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "errorType": "TypeError",
    "message": "Cannot read property '\''map'\'' of undefined",
    "stackTrace": "TypeError: Cannot read property '\''map'\'' of undefined\n    at ProductList.render (ProductList.jsx:45:12)\n    at finishClassComponent (react-dom.production.min.js:8891:31)",
    "severity": "error",
    "file": "ProductList.jsx",
    "line": 45,
    "metadata": {
      "url": "/products",
      "userAgent": "Chrome 119.0.0.0",
      "framework": "react",
      "environment": "production"
    }
  }'
```

---

#### 8. Manually Register an Error (Frontend Form)
```bash
curl -X POST http://localhost:3000/api/errors \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Database Connection Failed",
    "projectId": "PROJECT_UUID_HERE",
    "stackTrace": "Error: Connection timeout\n    at database.ts:12:34",
    "severity": "critical",
    "file": "database.ts",
    "line": "12",
    "environment": "production"
  }'
```

---

#### 9. Get All Errors (With Filters)
```bash
# Get all errors
curl http://localhost:3000/api/errors \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get errors with filters
curl "http://localhost:3000/api/errors?severity=error&status=unresolved&dateRange=7d" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Search errors
curl "http://localhost:3000/api/errors?search=TypeError" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Pagination
curl "http://localhost:3000/api/errors?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### 10. Get Error Details
```bash
# Replace ERROR_ID with an actual error ID
curl http://localhost:3000/api/errors/ERROR_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### 11. Update Error Status
```bash
curl -X PATCH http://localhost:3000/api/errors/ERROR_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved"
  }'
```

---

#### 12. Get Dashboard Stats
```bash
curl http://localhost:3000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response:
```json
{
  "totalErrors": 5,
  "unresolved": 3,
  "resolved": 2,
  "activeProjects": 1,
  "recentErrors": [...]
}
```

---

#### 13. Get Recent Errors
```bash
curl http://localhost:3000/api/dashboard/recent-errors \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔍 Testing Workflow

### Complete Testing Flow:

```bash
# 1. Start services
docker-compose up postgres backend

# 2. Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"John","lastName":"Doe"}'

# 3. Login (save the token!)
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | jq -r '.access_token')

echo "Token: $TOKEN"

# 4. Create project (save the apiKey!)
PROJECT=$(curl -s -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test App","description":"Test project"}')

API_KEY=$(echo $PROJECT | jq -r '.apiKey')
PROJECT_ID=$(echo $PROJECT | jq -r '.id')

echo "API Key: $API_KEY"
echo "Project ID: $PROJECT_ID"

# 5. Report error via SDK
curl -X POST http://localhost:3000/api/errors/report \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "errorType": "TypeError",
    "message": "Cannot read property '\''map'\'' of undefined",
    "stackTrace": "TypeError at ProductList.jsx:45",
    "severity": "error"
  }'

# 6. Check dashboard
curl http://localhost:3000/api/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"

# 7. List errors
curl http://localhost:3000/api/errors \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🛠️ Using Postman or Insomnia

### Setup:

1. **Import Environment Variables:**
   - `base_url`: `http://localhost:3000/api`
   - `token`: (will be set after login)
   - `api_key`: (will be set after creating project)

2. **Create Request Collection:**
   - Health Check
   - Register → Save token to environment
   - Login → Save token to environment
   - Get Profile (uses token)
   - Create Project → Save apiKey to environment
   - Report Error (uses apiKey)
   - Get Errors (uses token)
   - Dashboard Stats (uses token)

### Postman Pre-request Script (Auto-save token):
```javascript
// In Login request, Tests tab:
pm.environment.set("token", pm.response.json().access_token);
```

---

## 🐛 Troubleshooting

### Backend won't start:
- Check if PostgreSQL is running: `docker ps`
- Check if port 3000 is available: `lsof -i :3000`
- Check backend logs: `docker-compose logs backend`

### Database connection errors:
- Verify `.env` file exists with correct database credentials
- Check PostgreSQL is accessible: `docker ps` or `psql -h localhost -U admin -d error_management`

### 401 Unauthorized:
- Make sure you're using the correct token
- Token might have expired (default: 7 days)
- Check Authorization header format: `Bearer YOUR_TOKEN`

### 404 Not Found:
- Make sure URL is correct: `http://localhost:3000/api/...`
- Check backend is running and listening on port 3000

---

## ✅ Quick Verification Checklist

- [ ] Backend starts without errors
- [ ] Health endpoint returns OK
- [ ] Can register a new user
- [ ] Can login and get JWT token
- [ ] Can access protected routes with JWT
- [ ] Can create a project
- [ ] Can report error via API key
- [ ] Can list errors
- [ ] Dashboard stats work
- [ ] Error fingerprinting groups similar errors

---

## 📝 Notes

- JWT tokens expire after 7 days (configurable)
- API keys are permanent (until project is deleted)
- Error fingerprinting automatically groups similar errors
- Database tables are auto-created on first run (development mode)

