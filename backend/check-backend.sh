#!/bin/bash

echo "🔍 Backend Diagnostic Check"
echo "=========================="
echo ""

# Check if port 3000 is in use
echo "1. Checking if port 3000 is in use..."
if lsof -i :3000 > /dev/null 2>&1; then
    echo "   ✅ Port 3000 is in use"
    lsof -i :3000
else
    echo "   ❌ Port 3000 is NOT in use (backend not running)"
fi
echo ""

# Check if PostgreSQL is running
echo "2. Checking PostgreSQL connection..."
if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "   ✅ PostgreSQL is running"
else
    echo "   ❌ PostgreSQL is NOT running or not accessible"
    echo "   Try: docker-compose up -d postgres"
fi
echo ""

# Check if node_modules exists
echo "3. Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules exists"
else
    echo "   ❌ node_modules missing - run: npm install"
fi
echo ""

# Check if dist folder exists
echo "4. Checking build folder..."
if [ -d "dist" ]; then
    echo "   ✅ dist folder exists"
else
    echo "   ⚠️  dist folder missing (will be created on first build)"
fi
echo ""

# Try to test the health endpoint
echo "5. Testing health endpoint..."
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "   ✅ Backend is responding!"
    curl http://localhost:3000/api/health
else
    echo "   ❌ Backend is NOT responding"
    echo "   Error: $(curl -s http://localhost:3000/api/health 2>&1 | head -1)"
fi
echo ""

echo "=========================="
echo "💡 To start the backend:"
echo "   cd backend"
echo "   npm run start:dev"
echo ""

