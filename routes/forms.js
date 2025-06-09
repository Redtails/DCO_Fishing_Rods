// routes/forms.js
const express = require('express');
const sql     = require('mssql');
const bcrypt  = require('bcrypt');
const config  = require('../db/config');

const router = express.Router();

/* 1) Defect Entry */

// POST /api/defect-entry
router.post('/defect-entry', async (req, res) => {
  const { batchNumber, defectType, shift, technicianId, notes } = req.body;
  if (!batchNumber || !defectType || !shift || typeof technicianId !== 'number') {
    return res.status(400).send('❗ Invalid payload');
  }
  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.DefectReport
        (batch_id, defect_type, shift, technician_id, notes, timestamp)
      VALUES
        (${batchNumber}, ${defectType}, ${shift}, ${technicianId}, ${notes}, GETDATE())
    `;
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// GET /api/defect-entry
router.get('/defect-entry', async (_, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT batch_id, defect_type, shift, technician_id, notes, timestamp
      FROM dbo.DefectReport
      ORDER BY timestamp DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// DELETE /api/defect-entry/:batchId
router.delete('/defect-entry/:batchId', async (req, res) => {
  const { batchId } = req.params;
  try {
    await sql.connect(config);
    await sql.query`
      DELETE FROM dbo.DefectReport
      WHERE batch_id = ${batchId}
    `;
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

/* 2) Inventory Update */

// POST /api/inventory-update
router.post('/inventory-update', async (req, res) => {
  const { itemId, quantity, reasonCode, staffId } = req.body;
  if (!itemId || typeof quantity !== 'number' || !reasonCode || typeof staffId !== 'number') {
    return res.status(400).send('❗ Invalid payload');
  }
  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.InventoryRecord
        (item_id, quantity, reason_code, staff_id, timestamp)
      VALUES
        (${itemId}, ${quantity}, ${reasonCode}, ${staffId}, GETDATE())
    `;
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// GET /api/inventory-update
router.get('/inventory-update', async (_, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT item_id, quantity, reason_code, staff_id, timestamp
      FROM dbo.InventoryRecord
      ORDER BY timestamp DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// DELETE /api/inventory-update/:itemId
router.delete('/inventory-update/:itemId', async (req, res) => {
  const { itemId } = req.params;
  try {
    await sql.connect(config);
    await sql.query`
      DELETE FROM dbo.InventoryRecord
      WHERE item_id = ${itemId}
    `;
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

/* 3) Inspection Report */

// POST /api/inspection-report
router.post('/inspection-report', async (req, res) => {
  const { batch_id, shift, inspector_id, findings } = req.body;
  if (!batch_id || !shift || typeof inspector_id !== 'number' || !findings) {
    return res.status(400).send('❗ Invalid payload');
  }
  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.InspectionReport
        (batch_id, shift, inspector_id, findings, timestamp)
      VALUES
        (${batch_id}, ${shift}, ${inspector_id}, ${findings}, GETDATE())
    `;
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// GET /api/inspection-report
router.get('/inspection-report', async (_, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT batch_id, shift, inspector_id, findings, timestamp
      FROM dbo.InspectionReport
      ORDER BY timestamp DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// DELETE /api/inspection-report/:batchId
router.delete('/inspection-report/:batchId', async (req, res) => {
  const { batchId } = req.params;
  try {
    await sql.connect(config);
    await sql.query`
      DELETE FROM dbo.InspectionReport
      WHERE batch_id = ${batchId}
    `;
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

/* 4) Maintenance Requests */

// POST /api/maintenance-request
router.post('/maintenance-request', async (req, res) => {
  const { equipmentId, issueDescription, requestedBy, priority, dateReported } = req.body;
  if (!equipmentId || typeof requestedBy !== 'number' || !issueDescription || !priority || !dateReported) {
    return res.status(400).send('❗ Invalid payload');
  }
  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.MaintenanceRequest
        (equipment_id, issue_description, requested_by, priority, date_reported, status, timestamp)
      VALUES
        (${equipmentId}, ${issueDescription}, ${requestedBy}, ${priority}, ${dateReported}, 'Pending', GETDATE())
    `;
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// GET /api/maintenance-request
router.get('/maintenance-request', async (_, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT request_id, equipment_id, issue_description, requested_by, status, timestamp
      FROM dbo.MaintenanceRequest
      ORDER BY timestamp DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// DELETE /api/maintenance-request/:requestId
router.delete('/maintenance-request/:requestId', async (req, res) => {
  const { requestId } = req.params;
  try {
    await sql.connect(config);
    await sql.query`
      DELETE FROM dbo.MaintenanceRequest
      WHERE request_id = ${requestId}
    `;
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

/* 5) Calibration Logs */

// POST /api/calibration-log
router.post('/calibration-log', async (req, res) => {
  const { equipmentId, calibrationDate, calibratedBy, nextDueDate, notes } = req.body;
  if (!equipmentId || !calibrationDate || typeof calibratedBy !== 'number' || !nextDueDate) {
    return res.status(400).send('❗ Invalid payload');
  }
  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.CalibrationLog
        (equipment_id, calibration_date, calibrated_by, next_due_date, notes, timestamp)
      VALUES
        (${equipmentId}, ${calibrationDate}, ${calibratedBy}, ${nextDueDate}, ${notes}, GETDATE())
    `;
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// GET /api/calibration-log
router.get('/calibration-log', async (_, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT calibration_log_id, equipment_id, calibration_date, calibrated_by, next_due_date, notes, timestamp
      FROM dbo.CalibrationLog
      ORDER BY timestamp DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// DELETE /api/calibration-log/:logId
router.delete('/calibration-log/:logId', async (req, res) => {
  const { logId } = req.params;
  try {
    await sql.connect(config);
    await sql.query`
      DELETE FROM dbo.CalibrationLog
      WHERE calibration_log_id = ${logId}
    `;
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

/* 6) User Management */

// POST /api/add-user
router.post('/add-user', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).send('❗ Missing fields');
  }
  try {
    await sql.connect(config);
    const hash = await bcrypt.hash(password, 10);
    await new sql.Request()
      .input('username',     sql.VarChar(50),  username)
      .input('passwordHash', sql.VarChar(255), hash)
      .input('role',         sql.VarChar(20),  role)
      .query(`
        INSERT INTO dbo.Users (username, password_hash, role)
        VALUES (@username, @passwordHash, @role)
      `);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    await sql.connect(config);
    const result = await new sql.Request()
      .input('username', sql.VarChar(50), username)
      .query(`
        SELECT user_id, username, password_hash, role
        FROM dbo.Users
        WHERE username = @username
      `);
    if (!result.recordset.length) return res.status(401).send('Invalid login');
    const user = result.recordset[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).send('Invalid login');
    res.json({ userId: user.user_id, username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;




