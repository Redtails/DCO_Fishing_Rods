const express = require('express');
const cors = require('cors');
const path = require('path');
const formRoutes = require('./routes/forms');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static HTML files from your actual folder name: 'rod management'
app.use(express.static(path.join(__dirname, 'rod-management')));

// API routes
app.use('/api', formRoutes);

// Serve dashboard.html on root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'rod-management', 'dashboard.html'));
});

// (Optional) If you ever add a 404 page named 404.html in that folder:
// app.get('*', (req, res) => {
//   res.status(404).sendFile(path.join(__dirname, 'rod management', '404.html'));
// });

// Start server
app.listen(PORT, () => {
  console.log(`✅ DCO API is running on http://localhost:${PORT}`);
});