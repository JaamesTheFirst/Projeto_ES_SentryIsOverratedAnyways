#!/bin/bash

# Complete Backend API Testing Script
# Make sure your backend is running on http://localhost:3000/api

echo "🧪 Testing Error Management Platform Backend API"
echo "================================================"
echo ""

BASE_URL="http://localhost:3000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "1️⃣  Testing Health Check..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')
if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    echo -e "${RED}❌ Health check failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 2: Register User
echo "2️⃣  Registering new user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }')
echo "$REGISTER_RESPONSE" | jq '.' 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# Test 3: Login
echo "3️⃣  Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }')
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"

# Extract token (works with or without jq)
if command -v jq &> /dev/null; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token' 2>/dev/null)
fi

# Fallback if jq not available or failed: use sed
if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')
fi

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ] || [ -z "${TOKEN// }" ]; then
    echo -e "${RED}❌ Failed to get token. Response: $LOGIN_RESPONSE${NC}"
    exit 1
fi

# Verify token is not empty and looks valid
if [ ${#TOKEN} -lt 20 ]; then
    echo -e "${RED}❌ Token seems too short: ${TOKEN}${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Token obtained (length: ${#TOKEN})${NC}"
echo ""

# Test 4: Get Profile
echo "4️⃣  Getting user profile..."
curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || \
curl -s -X GET "$BASE_URL/auth/me" -H "Authorization: Bearer $TOKEN"
echo ""

# Test 5: Create Project
echo "5️⃣  Creating a project..."
if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ TOKEN variable is empty!${NC}"
    exit 1
fi
# Debug: show token length (not the token itself for security)
echo "Using token (length: ${#TOKEN})..."
PROJECT_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE_URL/projects" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Web App",
    "description": "My test application",
    "icon": "🌐",
    "status": "active"
  }')
HTTP_CODE=$(echo "$PROJECT_RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
BODY=$(echo "$PROJECT_RESPONSE" | sed '/HTTP_CODE:/d')
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
if [ "$HTTP_CODE" != "201" ] && [ "$HTTP_CODE" != "200" ]; then
    echo -e "${YELLOW}⚠️  HTTP Status: $HTTP_CODE${NC}"
fi

# Extract project ID and API key (works with or without jq)
if command -v jq &> /dev/null; then
    PROJECT_ID=$(echo "$PROJECT_RESPONSE" | jq -r '.id' 2>/dev/null)
    API_KEY=$(echo "$PROJECT_RESPONSE" | jq -r '.apiKey' 2>/dev/null)
else
    # Fallback: extract using grep/sed
    PROJECT_ID=$(echo "$PROJECT_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    API_KEY=$(echo "$PROJECT_RESPONSE" | grep -o '"apiKey":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" == "null" ]; then
    echo -e "${RED}❌ Failed to create project. Exiting.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Project created: $PROJECT_ID${NC}"
echo -e "${GREEN}✅ API Key: ${API_KEY:0:20}...${NC}"
echo ""

# Test 6: List Projects
echo "6️⃣  Listing all projects..."
curl -s -X GET "$BASE_URL/projects" \
  -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || \
curl -s -X GET "$BASE_URL/projects" -H "Authorization: Bearer $TOKEN"
echo ""

# Test 7: Get Project Details
echo "7️⃣  Getting project details..."
curl -s -X GET "$BASE_URL/projects/$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || \
curl -s -X GET "$BASE_URL/projects/$PROJECT_ID" -H "Authorization: Bearer $TOKEN"
echo ""

# Test 8: Get Project Stats
echo "8️⃣  Getting project statistics..."
curl -s -X GET "$BASE_URL/projects/$PROJECT_ID/stats" \
  -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || \
curl -s -X GET "$BASE_URL/projects/$PROJECT_ID/stats" -H "Authorization: Bearer $TOKEN"
echo ""

# Test 9: Report Error via SDK (API Key Auth)
echo "9️⃣  Reporting error via SDK (API Key)..."
ERROR_RESPONSE=$(curl -s -X POST "$BASE_URL/errors/report" \
  -H "Authorization: Bearer $API_KEY" \
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
  }')
ERROR_ID=$(echo "$ERROR_RESPONSE" | jq -r '.id' 2>/dev/null)
echo "$ERROR_RESPONSE" | jq '.' 2>/dev/null || echo "$ERROR_RESPONSE"
if [ -z "$ERROR_ID" ] || [ "$ERROR_ID" == "null" ]; then
    echo -e "${YELLOW}⚠️  Error report may have failed${NC}"
else
    echo -e "${GREEN}✅ Error reported: $ERROR_ID${NC}"
fi
echo ""

# Test 10: Report Another Error (to test grouping)
echo "🔟 Reporting another similar error (should group)..."
curl -s -X POST "$BASE_URL/errors/report" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "errorType": "TypeError",
    "message": "Cannot read property '\''map'\'' of undefined",
    "stackTrace": "TypeError: Cannot read property '\''map'\'' of undefined\n    at ProductList.render (ProductList.jsx:45:12)",
    "severity": "error",
    "file": "ProductList.jsx",
    "line": 45
  }' | jq '.' 2>/dev/null || echo "Error reported"
echo ""

# Test 11: Report Different Error
echo "1️⃣1️⃣  Reporting different error..."
curl -s -X POST "$BASE_URL/errors/report" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "errorType": "ReferenceError",
    "message": "fetch is not defined",
    "stackTrace": "ReferenceError: fetch is not defined\n    at api.service.ts:89",
    "severity": "warning",
    "file": "api.service.ts",
    "line": 89
  }' | jq '.' 2>/dev/null || echo "Error reported"
echo ""

# Test 12: Manually Create Error (Frontend Form)
echo "1️⃣2️⃣  Manually creating error..."
curl -s -X POST "$BASE_URL/errors" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Database Connection Failed\",
    \"projectId\": \"$PROJECT_ID\",
    \"stackTrace\": \"Error: Connection timeout\\n    at database.ts:12:34\",
    \"severity\": \"critical\",
    \"file\": \"database.ts\",
    \"line\": \"12\",
    \"environment\": \"production\"
  }" | jq '.' 2>/dev/null || echo "Error created"
echo ""

# Test 13: List All Errors
echo "1️⃣3️⃣  Listing all errors..."
ERROR_LIST=$(curl -s -X GET "$BASE_URL/errors" \
  -H "Authorization: Bearer $TOKEN")
echo "$ERROR_LIST" | jq '.' 2>/dev/null || echo "$ERROR_LIST"

# Extract first error ID (works with or without jq)
if command -v jq &> /dev/null; then
    ERROR_ID=$(echo "$ERROR_LIST" | jq -r '.items[0].id' 2>/dev/null)
else
    # Fallback: extract using grep/sed (gets first id from items array)
    ERROR_ID=$(echo "$ERROR_LIST" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
fi
echo ""

# Test 14: List Errors with Filters
echo "1️⃣4️⃣  Listing errors with filters..."
curl -s -X GET "$BASE_URL/errors?severity=error&status=unresolved&dateRange=7d" \
  -H "Authorization: Bearer $TOKEN" | jq '.items | length' 2>/dev/null || echo "Filtered errors"
echo ""

# Test 15: Get Error Details
if [ ! -z "$ERROR_ID" ] && [ "$ERROR_ID" != "null" ]; then
    echo "1️⃣5️⃣  Getting error details..."
    curl -s -X GET "$BASE_URL/errors/$ERROR_ID" \
      -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || \
    curl -s -X GET "$BASE_URL/errors/$ERROR_ID" -H "Authorization: Bearer $TOKEN"
    echo ""
fi

# Test 16: Update Error Status
if [ ! -z "$ERROR_ID" ] && [ "$ERROR_ID" != "null" ]; then
    echo "1️⃣6️⃣  Updating error status to resolved..."
    curl -s -X PATCH "$BASE_URL/errors/$ERROR_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "status": "resolved"
      }' | jq '.' 2>/dev/null || echo "Error updated"
    echo ""
fi

# Test 17: Get Dashboard Stats
echo "1️⃣7️⃣  Getting dashboard statistics..."
curl -s -X GET "$BASE_URL/dashboard/stats" \
  -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || \
curl -s -X GET "$BASE_URL/dashboard/stats" -H "Authorization: Bearer $TOKEN"
echo ""

# Test 18: Get Recent Errors
echo "1️⃣8️⃣  Getting recent errors..."
curl -s -X GET "$BASE_URL/dashboard/recent-errors" \
  -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || \
curl -s -X GET "$BASE_URL/dashboard/recent-errors" -H "Authorization: Bearer $TOKEN"
echo ""

# Test 19: Update User Profile
echo "1️⃣9️⃣  Updating user profile..."
curl -s -X PATCH "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "bio": "Testing the API"
  }' | jq '.' 2>/dev/null || \
curl -s -X PATCH "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Updated", "bio": "Testing the API"}'
echo ""

# Test 20: Update Project
echo "2️⃣0️⃣  Updating project..."
curl -s -X PATCH "$BASE_URL/projects/$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description"
  }' | jq '.' 2>/dev/null || \
curl -s -X PATCH "$BASE_URL/projects/$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description": "Updated description"}'
echo ""

echo ""
echo "================================================"
echo -e "${GREEN}✅ All endpoint tests completed!${NC}"
echo ""
echo "Summary:"
echo "  - Health check"
echo "  - Authentication (register, login)"
echo "  - User profile management"
echo "  - Project CRUD operations"
echo "  - Error reporting (SDK and manual)"
echo "  - Error listing and filtering"
echo "  - Dashboard statistics"
echo ""
echo "Note: Some endpoints may show empty results if no data exists."
echo "This is normal for a fresh database."

