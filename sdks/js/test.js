const { ErrorTracker } = require('./dist/index.cjs.js');
const http = require('http');

// Configuration - set these environment variables or edit below
const EMAIL = process.env.ERROR_TRACKER_EMAIL || 'test@example.com';
const PASSWORD = process.env.ERROR_TRACKER_PASSWORD || 'password123';
const API_URL = process.env.ERROR_TRACKER_API_URL || 'http://localhost:3000/api';

// Helper function to make HTTP requests
function httpRequest(method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    // Ensure path starts with / and doesn't duplicate /api
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    const fullUrl = API_URL.endsWith('/') 
      ? API_URL + cleanPath.substring(1) 
      : API_URL + cleanPath;
    
    const url = new URL(fullUrl);
    const isHttps = url.protocol === 'https:';
    const httpModule = isHttps ? require('https') : require('http');
    
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = httpModule.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Get API key by logging in and creating/getting a project
async function getApiKey() {
  console.log('🔑 Getting API key...');

  try {
    // Step 1: Login
    console.log('   Logging in...');
    const loginResponse = await httpRequest('POST', '/auth/login', {}, {
      email: EMAIL,
      password: PASSWORD,
    });

    if (loginResponse.status !== 201 && loginResponse.status !== 200) {
      throw new Error(`Login failed: ${JSON.stringify(loginResponse.data)}`);
    }

    const token = loginResponse.data.access_token;
    if (!token) {
      throw new Error('No access token received');
    }

    console.log('   ✓ Login successful');

    // Step 2: Get existing projects
    console.log('   Fetching projects...');
    const projectsResponse = await httpRequest('GET', '/projects', {
      Authorization: `Bearer ${token}`,
    });

    let apiKey = null;

    // Check if we have any projects
    if (projectsResponse.status === 200 && Array.isArray(projectsResponse.data) && projectsResponse.data.length > 0) {
      // Use first project's API key
      apiKey = projectsResponse.data[0].apiKey;
      console.log(`   ✓ Using existing project: ${projectsResponse.data[0].name}`);
    } else {
      // Step 3: Create a new project
      console.log('   Creating new project...');
      const createResponse = await httpRequest('POST', '/projects', {
        Authorization: `Bearer ${token}`,
      }, {
        name: 'SDK Test Project',
        description: 'Auto-created for SDK testing',
      });

      if (createResponse.status !== 201 && createResponse.status !== 200) {
        throw new Error(`Failed to create project: ${JSON.stringify(createResponse.data)}`);
      }

      apiKey = createResponse.data.apiKey;
      console.log('   ✓ Project created');
    }

    if (!apiKey) {
      throw new Error('No API key found');
    }

    console.log(`   ✓ API Key: ${apiKey.substring(0, 20)}...`);
    return apiKey;
  } catch (error) {
    console.error('   ✗ Failed to get API key:', error.message);
    throw error;
  }
}

// Main test function
async function runTest() {
  try {
    // Get API key
    const apiKey = await getApiKey();

    console.log('\n📦 Initializing ErrorTracker...');
    ErrorTracker.init({
      apiKey: apiKey,
      apiUrl: API_URL,
      environment: 'test',
    });

    console.log('✓ SDK initialized');

    console.log('\n🚀 Sending test error...');
    ErrorTracker.captureError(new Error('JS SDK Test - Automated'), 'error', {
      test: true,
      timestamp: new Date().toISOString(),
    });

    console.log('✓ Test error sent!');
    console.log('\n✅ Check your dashboard at http://localhost:5173/errors to see the error!');

    // Give it a moment to send
    await new Promise(resolve => setTimeout(resolve, 1000));
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. Backend is running (http://localhost:3000)');
    console.error('   2. You have a user account with email:', EMAIL);
    console.error('   3. Or set ERROR_TRACKER_EMAIL and ERROR_TRACKER_PASSWORD env vars');
    process.exit(1);
  }
}

// Run the test
runTest();
