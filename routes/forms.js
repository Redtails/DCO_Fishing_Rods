const express = require('express');
const sql = require('mssql');
const config = require('../db/config');

const router = express.Router();

router.post('/defect-entry', async (req, res) => {
  const { batchNumber, defectType, shift, technicianId, notes } = req.body;

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.DefectReport (batch_id, defect_type, shift, technician_id, notes, timestamp)
      VALUES (${batchNumber}, ${defectType}, ${shift}, ${technicianId}, ${notes}, GETDATE())
    `;
    res.status(200).send('Defect entry saved');
  } catch (err) {
    console.error('Error inserting defect:', err);
    res.status(500).send(err.message);
  }
});

module.exports = router;

