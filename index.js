const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/forms');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── CORS FIX ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: 'https://dco-fishing-rods.onrender.com', // ✅ exact frontend domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ─── STATIC ASSETS ────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'rod-management')));

// ─── API ROUTES ───────────────────────────────────────────────────────────────
app.use('/api', authRoutes);
app.use('/api', formRoutes);

// ─── PAGE ROUTES ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'rod-management', 'login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'rod-management', 'dashboard.html'));
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ DCO API is running on http://localhost:${PORT}`);
});
