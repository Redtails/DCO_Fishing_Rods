const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const authRoutes = require('./routes/auth');   // login endpoint
const formRoutes = require('./routes/forms');  // your form endpoints

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── STATIC ASSETS ────────────────────────────────────────────────────────────
// serve login.html, dashboard.html, and all other HTML/CSS/JS from rod‐management/
app.use(express.static(path.join(__dirname, 'rod-management')));

// ─── API ROUTES ────────────────────────────────────────────────────────────────
// Login/auth must come first so it’s not overridden by formRoutes
app.use('/api', authRoutes);
app.use('/api', formRoutes);

// ─── PAGE ROUTING ──────────────────────────────────────────────────────────────
// Public entrypoint: always show login first
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'rod-management', 'login.html'));
});

// Protected dashboard (client‐side checks role in sessionStorage)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'rod-management', 'dashboard.html'));
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ DCO API is running on http://localhost:${PORT}`);
});
