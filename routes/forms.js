// routes/forms.js
const express = require('express');
const sql     = require('mssql');
const config  = require('../db/config');

const router = express.Router();

/* 1) Defect Entry */

// POST /api/defect-entry
router.post('/defect-entry', async (req, res) => {
  console.log('📬 defect-entry payload:', req.body);
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
    res.status(200).send('✅ Defect entry saved');
  } catch (err) {
    console.error('Error inserting defect:', err);
    res.status(500).send(err.message);
  }
});

// GET /api/defect-entry
router.get('/defect-entry', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT batch_id, defect_type, shift, technician_id, notes, timestamp
      FROM dbo.DefectReport
      ORDER BY timestamp DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error reading defects:', err);
    res.status(500).send(err.message);
  }
});

/* 2) Inventory Update */

// POST /api/inventory-update
router.post('/inventory-update', async (req, res) => {
  console.log('📬 inventory-update payload:', req.body);
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
    res.status(200).send('✅ Inventory update saved');
  } catch (err) {
    console.error('Error updating inventory:', err);
    res.status(500).send(err.message);
  }
});

// GET /api/inventory-update
router.get('/inventory-update', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT item_id, quantity, reason_code, staff_id, timestamp
      FROM dbo.InventoryRecord
      ORDER BY timestamp DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error reading inventory:', err);
    res.status(500).send(err.message);
  }
});

/* 3) Inspection Report */

// POST /api/inspection-report
router.post('/inspection-report', async (req, res) => {
  console.log('📬 inspection-report payload:', req.body);
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
    res.status(200).send('✅ Inspection report saved');
  } catch (err) {
    console.error('Error saving inspection report:', err);
    res.status(500).send(err.message);
  }
});

// GET /api/inspection-report
router.get('/inspection-report', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT batch_id, shift, inspector_id, findings, timestamp
      FROM dbo.InspectionReport
      ORDER BY timestamp DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error reading inspection reports:', err);
    res.status(500).send(err.message);
  }
});

/* 4) Work Order Submission */

// POST /api/work-order
router.post('/work-order', async (req, res) => {
  console.log('📬 work-order payload:', req.body);
  const { work_order_id, requested_by, department, due_date, description } = req.body;
  if (!work_order_id || !requested_by || !department || !due_date || !description) {
    return res.status(400).send('❗ Invalid payload');
  }
  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.WorkOrder
        (work_order_no, description, department, requested_by, due_date, timestamp)
      VALUES
        (${work_order_id}, ${description}, ${department}, ${requested_by}, ${due_date}, GETDATE())
    `;
    res.status(200).send('✅ Work order saved');
  } catch (err) {
    console.error('Error saving work order:', err);
    res.status(500).send(err.message);
  }
});

// GET /api/work-order
router.get('/work-order', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT work_order_no, description, department, requested_by, due_date, timestamp
      FROM dbo.WorkOrder
      ORDER BY timestamp DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error reading work orders:', err);
    res.status(500).send(err.message);
  }
});

/* 5) Maintenance Request */

// POST /api/maintenance-request
router.post('/maintenance-request', async (req, res) => {
  console.log('📬 maintenance-request payload:', req.body);
  const {
    equipmentId,
    issueDescription,
    requestedBy,
    priority,
    dateReported
  } = req.body;

  if (
    !equipmentId ||
    typeof requestedBy !== 'number' ||
    !issueDescription ||
    !priority ||
    !dateReported
  ) {
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
    res.status(200).send('✅ Maintenance request saved');
  } catch (err) {
    console.error('Error saving maintenance request:', err);
    res.status(500).send(err.message);
  }
});

// GET /api/maintenance-request
router.get('/maintenance-request', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT equipment_id, issue_description, requested_by, priority, date_reported, status, timestamp
      FROM dbo.MaintenanceRequest
      ORDER BY timestamp DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error reading maintenance requests:', err);
    res.status(500).send(err.message);
  }
});

/* 6) Calibration Log Entry */

// POST /api/calibration-log
router.post('/calibration-log', async (req, res) => {
  console.log('📬 calibration-log payload:', req.body);
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
    res.status(200).send('✅ Calibration log entry saved');
  } catch (err) {
    console.error('Error saving calibration log:', err);
    res.status(500).send(err.message);
  }
});

// GET /api/calibration-log
router.get('/calibration-log', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT equipment_id, calibration_date, calibrated_by, next_due_date, notes, timestamp
      FROM dbo.CalibrationLog
      ORDER BY timestamp DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error reading calibration logs:', err);
    res.status(500).send(err.message);
  }
});

/* 7) Add New User Endpoint */

// POST /api/add-user
router.post('/add-user', async (req, res) => {
  console.log('📬 add-user payload:', req.body);
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).send('❗ Missing required fields (username, password, role)');
  }
  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.Users (username, password, role, created_at)
      VALUES (${username}, ${password}, ${role}, GETDATE())
    `;
    res.status(201).send('✅ User created');
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).send(err.message);
  }
});

module.exports = router;



