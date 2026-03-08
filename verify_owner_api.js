
const BASE_URL = 'http://localhost:5000/api';
const MASTER_KEY = 'juteit_secret_admin_2026_key';

const test = async () => {
    try {
        console.log('--- Testing Owner Management API ---');

        // 1. Delete user if exists
        console.log('1. Cleaning up admin@juteit.com...');
        try {
            await fetch(`${BASE_URL}/auth/delete-owner`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-master-key': MASTER_KEY
                },
                body: JSON.stringify({ email: 'admin@juteit.com' })
            });
            console.log('   Cleanup request sent.');
        } catch (e) {
            console.log('   Error during cleanup.');
        }

        // 2. Setup Owner
        console.log('2. Setting up owner...');
        const resSetup = await fetch(`${BASE_URL}/auth/setup-owner`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-master-key': MASTER_KEY
            },
            body: JSON.stringify({
                name: 'Shaan Khan',
                email: 'admin@juteit.com',
                password: 'password123'
            })
        });
        const setupData = await resSetup.json();
        console.log('   Setup Status:', resSetup.status);
        console.log('   Role assigned:', setupData.user?.role);

        // 3. Verify via Login
        console.log('3. Verifying via Login...');
        const resLogin = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@juteit.com',
                password: 'password123'
            })
        });
        const loginData = await resLogin.json();
        console.log('   Login Status:', resLogin.status);
        console.log('   Login Role:', loginData.role);

        if (loginData.role === 'owner') {
            console.log('--- SUCCESS: Owner correctly assigned! ---');
        } else {
            console.error('--- FAILURE: Role is', loginData.role, '---');
        }

    } catch (error) {
        console.error('Test error:', error);
    }
};

test();
