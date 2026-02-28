/**
 * Quick API test for auth. Run from project root: node server/test-auth.js
 * Requires: server running (npm run dev in server/), MONGO_URI in .env
 */
const BASE = 'http://localhost:5000/api';

async function request(method, path, body = null, token = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function run() {
  console.log('1. Health check...');
  const health = await request('GET', '/health');
  console.log(health.status === 200 ? '   OK' : '   FAIL', health);

  console.log('\n2. Register new user...');
  const reg = await request('POST', '/auth/register', {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });
  if (reg.status !== 201) {
    console.log('   FAIL (maybe user exists)', reg);
    console.log('   Try login instead with test@example.com / password123');
  } else {
    console.log('   OK', { token: reg.data.token ? '...' : null, user: reg.data.user });
  }

  console.log('\n3. Login...');
  const login = await request('POST', '/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  });
  if (login.status !== 200) {
    console.log('   FAIL', login);
    process.exit(1);
  }
  console.log('   OK', { user: login.data.user });
  const token = login.data.token;

  console.log('\n4. Get me (protected)...');
  const me = await request('GET', '/auth/me', null, token);
  console.log(me.status === 200 ? '   OK' : '   FAIL', me.data);

  console.log('\nDone. Auth API is working.');
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
