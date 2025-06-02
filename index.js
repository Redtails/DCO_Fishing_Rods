// index.js

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/forms');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── CORS ────────────────────────────────────────────────────────────────
// Allow requests only from the front-end’s exact origin
app.use(cors({
  origin: 'https://dco-fishing-rods.onrender.com',
  methods: ['GET','POST'],
  allowedHeaders: ['Content-Type']
}));

// Parse JSON bodies automatically
app.use(express.json());

// ─── SERVE STATIC FILES ───────────────────────────────────────────────────
// Any request for “/*.html”, “/*.css”, “/*.js”, images, etc. comes from /rod-management.
app.use(express.static(path.join(__dirname, 'rod-management')));

// ─── API ROUTES ────────────────────────────────────────────────────────────
// Mount all auth endpoints under /api
app.use('/api', authRoutes);
// Mount all form‐related endpoints under /api
app.use('/api', formRoutes);

// ─── PAGE ROUTES ───────────────────────────────────────────────────────────
// GET “/” → serve login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'rod-management', 'login.html'));
});

// GET “/dashboard” → serve dashboard page (client‐side JS will check sessionStorage.role)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'rod-management', 'dashboard.html'));
});

// ─── START SERVER ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ DCO API is running on http://localhost:${PORT}`);
});
