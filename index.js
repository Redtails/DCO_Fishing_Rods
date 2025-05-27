const express = require('express');
const cors = require('cors');
const path = require('path');
const formRoutes = require('./routes/forms');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static HTML files from the 'rod-management' folder
app.use(express.static(path.join(__dirname, 'rod-management')));

// API routes
app.use('/api', formRoutes);

// Serve dashboard.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'rod-management', 'dashboard.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ DCO API is running on http://localhost:${PORT}`);
});
