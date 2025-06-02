// index.js

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const authRoutes = require('./routes/auth');   // e.g. login endpoints
const formRoutes = require('./routes/forms');  // your form endpoints

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── 1) CORS SETUP ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: 'https://dco-fishing-rods.onrender.com',
    methods: ['GET','POST','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
  })
);

// Also reply to any OPTIONS “preflight” automatically:
app.options('*', cors());

// ─── 2) JSON BODY PARSER ─────────────────────────────────────────────────────────
app.use(express.json());

// ─── 3) SERVE STATIC HTML/CSS/JS ───────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'rod-management')));

// ─── 4) MOUNT API ROUTES ──────────────────────────────────────────────────────────
// *** Notice I use ONLY '/api' as the prefix—never a full URL ***
app.use('/api', authRoutes);
app.use('/api', formRoutes);

// ─── 5) PAGE ROUTING ───────────────────────────────────────────────────────────────
// Public login page:
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'rod-management', 'login.html'));
});

// Protected dashboard (client-side will check sessionStorage role)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'rod-management', 'dashboard.html'));
});

// ─── 6) START THE SERVER ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ DCO API listening on port ${PORT}`);
});
