from error_tracker import init, capture_error
import requests
import os
import sys

API_URL = os.getenv('ERROR_TRACKER_API_URL', 'http://localhost:3000/api')
EMAIL = os.getenv('ERROR_TRACKER_EMAIL', 'test@example.com')
PASSWORD = os.getenv('ERROR_TRACKER_PASSWORD', 'password123')

def get_api_key():
    print('🔑 Getting API key...')

    # Login
    print('   Logging in...')
    login_response = requests.post(
        f'{API_URL}/auth/login',
        json={'email': EMAIL, 'password': PASSWORD}
    )

    if login_response.status_code not in [200, 201]:
        raise Exception(f'Login failed: {login_response.text}')

    token = login_response.json()['access_token']
    print('   ✓ Login successful')
    
    # Get projects
    print('   Fetching projects...')
    projects_response = requests.get(
        f'{API_URL}/projects',
        headers={'Authorization': f'Bearer {token}'}
    )
    
    api_key = None
    if projects_response.status_code == 200:
        projects = projects_response.json()
        if projects and len(projects) > 0:
            api_key = projects[0]['apiKey']
            print(f'   ✓ Using existing project: {projects[0]["name"]}')
    
    if not api_key:
        # Create project
        print('   Creating new project...')
        create_response = requests.post(
            f'{API_URL}/projects',
            headers={'Authorization': f'Bearer {token}'},
            json={'name': 'SDK Test Project', 'description': 'Auto-created for SDK testing'}
        )
        
        if create_response.status_code not in [200, 201]:
            raise Exception(f'Failed to create project: {create_response.text}')
        
        api_key = create_response.json()['apiKey']
        print('   ✓ Project created')
    
    print(f'   ✓ API Key: {api_key[:20]}...')
    return api_key

if __name__ == '__main__':
    try:
        api_key = get_api_key()
        
        print('\n📦 Initializing ErrorTracker...')
        init(
            api_key=api_key,
            api_url=API_URL,
            environment='test'
        )
        print('✓ SDK initialized')
        
        print('\n🚀 Sending test error...')
        capture_error(
            Exception('Python SDK Test - Automated'),
            severity='error',
            metadata={'test': True, 'sdk': 'python'}
        )
        print('✓ Test error sent!')
        print('\n✅ Check your dashboard at http://localhost:5173/errors to see the error!')
    except Exception as e:
        print(f'\n❌ Test failed: {e}')
        print('\n💡 Make sure:')
        print('   1. Backend is running (http://localhost:3000)')
        print('   2. You have a user account')
        print('   3. Or set ERROR_TRACKER_EMAIL and ERROR_TRACKER_PASSWORD env vars')
        sys.exit(1)
