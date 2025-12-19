#!/bin/bash

echo "🧪 Setting up React SDK test..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from sdks/react directory"
    exit 1
fi

# Build JS SDK first (dependency)
echo "📦 Building JS SDK..."
cd ../js
if [ ! -d "node_modules" ]; then
    echo "   Installing JS SDK dependencies..."
    npm install
fi
npm run build
cd ../react

# Install React SDK dependencies
echo "📦 Installing React SDK dependencies..."
npm install

# Build React SDK
echo "🔨 Building React SDK..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "To test:"
echo "  1. Open test.html in a browser"
echo "  2. Or use the test React app (see README)"
echo ""
echo "Quick test:"
echo "  python3 -m http.server 8080"
echo "  Then open http://localhost:8080/test.html"

