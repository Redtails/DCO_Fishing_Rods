// routes/auth.js

const express = require('express');
const sql     = require('mssql');
const bcrypt  = require('bcryptjs');
const config  = require('../db/config');

const router = express.Router();

// POST /api/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT user_id, password_hash, role
      FROM dbo.Users
      WHERE username = ${username}
    `;

    // If no matching user
    if (!result.recordset.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password_hash, role } = result.recordset[0];
    // Compare the plaintext password to the stored hash
    if (!bcrypt.compareSync(password, password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Successful login → return the user’s role
    res.json({ role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

