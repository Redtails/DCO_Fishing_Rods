// index.js  (or app.js)

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/forms');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── 1) CORS CONFIGURATION ─────────────────────────────────────────────────────
// Only allow requests coming from the exact frontend domain.
// Also explicitly allow OPTIONS so that preflight checks succeed.
const corsOptions = {
  origin: 'https://dco-fishing-rods.onrender.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Handle all OPTIONS preflight requests with the same CORS settings
app.options('*', cors(corsOptions));

// ─── 2) JSON BODY PARSER ───────────────────────────────────────────────────────
app.use(express.json());

// ─── 3) STATIC ASSETS ───────────────────────────────────────────────────────────
// This serves all of your HTML/CSS/JS files from rod-management/
app.use(express.static(path.join(__dirname, 'rod-management')));

// ─── 4) API ROUTES ───────────────────────────────────────────────────────────────
app.use('/api', authRoutes);
app.use('/api', formRoutes);

// ─── 5) PAGE ROUTING ─────────────────────────────────────────────────────────────
// Public entrypoint: show login.html first
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'rod-management', 'login.html'));
});

// Protected dashboard (client checks sessionStorage role)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'rod-management', 'dashboard.html'));
});

// ─── 6) START THE SERVER ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ DCO API is running on port ${PORT}`);
});
