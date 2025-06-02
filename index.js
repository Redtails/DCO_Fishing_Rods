// index.js (or app.js)

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const authRoutes = require('./routes/auth');   // your login endpoints
const formRoutes = require('./routes/forms');  // your form‐submission endpoints

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── 1) CORS CONFIG ────────────────────────────────────────────────────────────
// We only want to allow our frontend domain to call this API:
const corsOptions = {
  origin: 'https://dco-fishing-rods.onrender.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS to every request
app.use(cors(corsOptions));

// Also explicitly handle OPTIONS preflight for all routes:
app.options('*', cors(corsOptions));

// ─── 2) JSON BODY PARSER ────────────────────────────────────────────────────────
app.use(express.json());

// ─── 3) STATIC FILES ─────────────────────────────────────────────────────────────
// This serves everything in /rod-management (login.html, dashboard.html, individual forms, CSS, etc.)
app.use(express.static(path.join(__dirname, 'rod-management')));

// ─── 4) API ROUTES ───────────────────────────────────────────────────────────────
// Note: we use only “/api” prefix here—no full URLs.
app.use('/api', authRoutes);
app.use('/api', formRoutes);

// ─── 5) PAGE ROUTING ─────────────────────────────────────────────────────────────
// 5a) Public login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'rod-management', 'login.html'));
});

// 5b) Dashboard (client‐side script will guard this page by checking sessionStorage role)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'rod-management', 'dashboard.html'));
});

// ─── 6) START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ DCO API is up and running on port ${PORT}`);
});
