// routes/inspection-report.js
const express = require('express');
const router  = express.Router();
const sql     = require('mssql');
const config  = require('../db/config');  // if you load your DB config here

// ensure your index.js has: app.use(express.json());

router.post('/', async (req, res) => {
  console.log('▶️  inspection-report body:', req.body);
  const { batch_id, shift, inspector_id, findings } = req.body;

  // Validate required fields
  if (!batch_id || !shift || !inspector_id || !findings) {
    return res
      .status(400)
      .json({ error: 'batch_id, shift, inspector_id, and findings are required.' });
  }

  try {
    // Connect (if you don't already have a global connection)
    await sql.connect(config);

    // Insert, using GETDATE() for timestamp
    await sql.query`
      INSERT INTO dbo.InspectionReport
        (batch_id, shift, inspector_id, findings, timestamp)
      VALUES
        (${batch_id}, ${shift}, ${inspector_id}, ${findings}, GETDATE())
    `;

    res.json({ success: true });
  } catch (err) {
    console.error('🔴 SQL Error on inspection-report:', err);
    res.status(500).json({ error: 'Database insert failed.' });
  }
});

module.exports = router;
