const path = require('path');
const fs = require('fs');

// Always load server/.env ourselves so it is never overridden by root .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const idx = line.indexOf('=');
    if (idx > 0 && !line.trim().startsWith('#')) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      if (key) process.env[key] = val;
    }
  });
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/topics', require('./routes/topicRoutes'));

// Global error handler (for async errors passed via next(err))
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  if (res.headersSent) return next(err);
  const message = (err && (err.message || err.reason)) || 'Server error';
  res.status(500).json({ message });
});

const PORT = process.env.PORT || 5000;

async function start() {
  const uri = process.env.MONGO_URI || '';
  if (!uri) {
    console.error('Missing MONGO_URI in server/.env');
    process.exit(1);
  }
  if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
    console.error('MONGO_URI points to localhost. Use MongoDB Atlas and put the mongodb+srv://... URL in server/.env');
    process.exit(1);
  }
  // Show we're using Atlas (mask password)
  const masked = uri.replace(/:([^@]+)@/, ':****@');
  console.log('Using MONGO_URI:', masked);
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start:', err.message || err);
  if ((err.message || '').toLowerCase().includes('auth')) {
    console.error('\n>>> Fix: In MongoDB Atlas go to Database Access → your user → Edit → Edit Password. Set a new password, then put the SAME password in server/.env in MONGO_URI (after the colon after the username).');
  }
  process.exit(1);
});
