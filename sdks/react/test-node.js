/**
 * Node.js test for React SDK
 * Tests the SDK without React (just the core functionality)
 */

// This would normally import from the built package
// For testing, we'll use the JS SDK directly
const path = require('path');

// Try to load the built React SDK
let ErrorTracker, ErrorBoundary, hooks;
try {
  const reactSdk = require('./dist/index.cjs.js');
  ErrorTracker = reactSdk.ErrorTracker || reactSdk.default;
  ErrorBoundary = reactSdk.ErrorBoundary;
  hooks = reactSdk;
} catch (e) {
  console.error('❌ React SDK not built. Run: npm run build');
  console.error('   Or use the JS SDK directly for Node.js testing');
  process.exit(1);
}

// Test configuration
const API_KEY = process.env.ERROR_TRACKER_API_KEY || 'YOUR_API_KEY';
const API_URL = process.env.ERROR_TRACKER_API_URL || 'http://localhost:3000/api';

async function testSDK() {
  console.log('🧪 Testing React SDK (Node.js mode)...\n');

  // Initialize
  console.log('1️⃣  Initializing SDK...');
  ErrorTracker.init({
    apiKey: API_KEY,
    apiUrl: API_URL,
    environment: 'test',
    release: '1.0.0',
  });
  console.log('   ✅ SDK initialized\n');

  // Test manual error capture
  console.log('2️⃣  Testing manual error capture...');
  try {
    throw new Error('Test error from React SDK (Node.js)');
  } catch (error) {
    ErrorTracker.captureError(error, 'error', {
      test: true,
      source: 'react-sdk-node-test',
    });
    console.log('   ✅ Error captured\n');
  }

  // Test message capture
  console.log('3️⃣  Testing message capture...');
  ErrorTracker.captureMessage('Test message from React SDK', 'info', {
    test: true,
    source: 'react-sdk-node-test',
  });
  console.log('   ✅ Message captured\n');

  // Test user context
  console.log('4️⃣  Testing user context...');
  ErrorTracker.setUser({
    id: 'test-user-123',
    email: 'test@example.com',
    username: 'testuser',
  });
  console.log('   ✅ User context set\n');

  // Test tags
  console.log('5️⃣  Testing tags...');
  ErrorTracker.setTags({
    test: 'react-sdk',
    environment: 'node',
  });
  console.log('   ✅ Tags set\n');

  console.log('✅ All tests completed!');
  console.log('\n📊 Check your dashboard at http://localhost:5173/errors');
  console.log('   to see the captured errors.\n');

  // Give it a moment to send
  await new Promise(resolve => setTimeout(resolve, 1000));
}

// Run tests
if (API_KEY === 'YOUR_API_KEY') {
  console.log('⚠️  Warning: Using placeholder API key');
  console.log('   Set ERROR_TRACKER_API_KEY environment variable or edit test-node.js\n');
}

testSDK().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});

