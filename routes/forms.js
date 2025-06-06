// routes/forms.js

const express = require('express');
const sql     = require('mssql');
const config  = require('../db/config');

const router = express.Router();

/* ─────────────────────────────────────────────────────────────────────────────
   1) Defect Entry
   ──────────────────────────────────────────────────────────────────────────── */

// 1a) POST /api/defect-entry
//    Accepts a new defect report payload and inserts it into DefectReport table.
router.post('/defect-entry', async (req, res) => {
  const { batchNumber, defectType, shift, technicianId, notes } = req.body;

  // Basic validation: batchNumber, defectType, shift must exist and technicianId must be a number
  if (
    !batchNumber ||
    !defectType ||
    !shift ||
    typeof technicianId !== 'number'
  ) {
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
    return res.status(200).send('✅ Defect entry saved');
  } catch (err) {
    console.error('Error inserting defect:', err);
    return res.status(500).send(err.message);
  }
});

// 1b) GET /api/defect-entry
//    Returns all rows from DefectReport as JSON so the dashboard can display them.
router.get('/defect-entry', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT
        batch_id,
        defect_type,
        shift,
        technician_id,
        notes,
        timestamp
      FROM dbo.DefectReport
      ORDER BY timestamp DESC
    `;
    return res.json(result.recordset);
  } catch (err) {
    console.error('Error reading defects:', err);
    return res.status(500).send(err.message);
  }
});


/* ─────────────────────────────────────────────────────────────────────────────
   2) Inventory Update
   ──────────────────────────────────────────────────────────────────────────── */

// 2a) POST /api/inventory-update
//    Accepts a new inventory update payload and inserts it into InventoryRecord table.
router.post('/inventory-update', async (req, res) => {
  const { itemId, quantity, reasonCode, staffId } = req.body;

  // Basic validation: itemId and reasonCode must exist; quantity & staffId must be numbers
  if (
    !itemId ||
    typeof quantity !== 'number' ||
    !reasonCode ||
    typeof staffId !== 'number'
  ) {
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
    return res.status(200).send('✅ Inventory update saved');
  } catch (err) {
    console.error('Error updating inventory:', err);
    return res.status(500).send(err.message);
  }
});

// 2b) GET /api/inventory-update
//    Returns all rows from InventoryRecord as JSON so the dashboard can display them.
router.get('/inventory-update', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT
        item_id,
        quantity,
        reason_code,
        staff_id,
        timestamp
      FROM dbo.InventoryRecord
      ORDER BY timestamp DESC
    `;
    return res.json(result.recordset);
  } catch (err) {
    console.error('Error reading inventory:', err);
    return res.status(500).send(err.message);
  }
});


/* ─────────────────────────────────────────────────────────────────────────────
   3) Inspection Report
   ──────────────────────────────────────────────────────────────────────────── */

// 3a) POST /api/inspection-report
//    Accepts a new inspection report payload and inserts it into InspectionReport table.
router.post('/inspection-report', async (req, res) => {
  const { batchId, shift, inspectorId, findings } = req.body;

  // Basic validation: batchId & shift must exist, inspectorId must be a number
  if (
    !batchId ||
    !shift ||
    typeof inspectorId !== 'number'
  ) {
    return res.status(400).send('❗ Invalid payload');
  }

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.InspectionReport
        (batch_id, shift, inspector_id, findings, timestamp)
      VALUES
        (${batchId}, ${shift}, ${inspectorId}, ${findings}, GETDATE())
    `;
    return res.status(200).send('✅ Inspection report saved');
  } catch (err) {
    console.error('Error saving inspection report:', err);
    return res.status(500).send(err.message);
  }
});

// 3b) GET /api/inspection-report
//    Returns all rows from InspectionReport as JSON so the dashboard can display them.
router.get('/inspection-report', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT
        batch_id,
        shift,
        inspector_id,
        findings,
        timestamp
      FROM dbo.InspectionReport
      ORDER BY timestamp DESC
    `;
    return res.json(result.recordset);
  } catch (err) {
    console.error('Error reading inspection reports:', err);
    return res.status(500).send(err.message);
  }
});


/* ─────────────────────────────────────────────────────────────────────────────
   4) Work Order Submission
   ──────────────────────────────────────────────────────────────────────────── */

// 4a) POST /api/work-order
//    Accepts a new work‐order payload and inserts it into the WorkOrder table.
router.post('/work-order', async (req, res) => {
  const { workOrderNo, description, createdBy } = req.body;

  // Basic validation: workOrderNo & description must exist; createdBy must be a number
  if (
    !workOrderNo ||
    !description ||
    typeof createdBy !== 'number'
  ) {
    return res.status(400).send('❗ Invalid payload');
  }

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.WorkOrder
        (work_order_no, description, created_by, timestamp)
      VALUES
        (${workOrderNo}, ${description}, ${createdBy}, GETDATE())
    `;
    return res.status(200).send('✅ Work order saved');
  } catch (err) {
    console.error('Error saving work order:', err);
    return res.status(500).send(err.message);
  }
});

// 4b) GET /api/work-order
//    Returns all rows from WorkOrder as JSON so the dashboard can display them.
router.get('/work-order', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT
        work_order_no,
        description,
        created_by,
        timestamp
      FROM dbo.WorkOrder
      ORDER BY timestamp DESC
    `;
    return res.json(result.recordset);
  } catch (err) {
    console.error('Error reading work orders:', err);
    return res.status(500).send(err.message);
  }
});


/* ─────────────────────────────────────────────────────────────────────────────
   5) Maintenance Request
   ──────────────────────────────────────────────────────────────────────────── */

// 5a) POST /api/maintenance-request
//    Accepts a new maintenance request payload and inserts it into the MaintenanceRequest table.
router.post('/maintenance-request', async (req, res) => {
  const { equipmentId, issueDescription, requestedBy } = req.body;

  // Basic validation: equipmentId & issueDescription must exist; requestedBy must be a number
  if (
    !equipmentId ||
    !issueDescription ||
    typeof requestedBy !== 'number'
  ) {
    return res.status(400).send('❗ Invalid payload');
  }

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.MaintenanceRequest
        (equipment_id, issue_description, requested_by, timestamp)
      VALUES
        (${equipmentId}, ${issueDescription}, ${requestedBy}, GETDATE())
    `;
    return res.status(200).send('✅ Maintenance request saved');
  } catch (err) {
    console.error('Error saving maintenance request:', err);
    return res.status(500).send(err.message);
  }
});

// 5b) GET /api/maintenance-request
//    Returns all rows from MaintenanceRequest as JSON so the dashboard can display them.
router.get('/maintenance-request', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT
        equipment_id,
        issue_description,
        requested_by,
        status,       -- if you have a “status” column
        timestamp
      FROM dbo.MaintenanceRequest
      ORDER BY timestamp DESC
    `;
    return res.json(result.recordset);
  } catch (err) {
    console.error('Error reading maintenance requests:', err);
    return res.status(500).send(err.message);
  }
});


/* ─────────────────────────────────────────────────────────────────────────────
   6) Calibration Log Entry
   ──────────────────────────────────────────────────────────────────────────── */

// 6a) POST /api/calibration-log
//    Accepts a new calibration log entry and inserts it into CalibrationLog table.
router.post('/calibration-log', async (req, res) => {
  const { equipmentId, calibrationDate, calibratedBy, nextDueDate, notes } = req.body;

  // Basic validation: equipmentId, calibrationDate, nextDueDate must exist; calibratedBy must be a number
  if (
    !equipmentId ||
    !calibrationDate ||
    typeof calibratedBy !== 'number' ||
    !nextDueDate
  ) {
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
    return res.status(200).send('✅ Calibration log entry saved');
  } catch (err) {
    console.error('Error saving calibration log:', err);
    return res.status(500).send(err.message);
  }
});

// 6b) GET /api/calibration-log
//    Returns all rows from CalibrationLog as JSON so the dashboard can display them.
router.get('/calibration-log', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT
        equipment_id,
        calibration_date,
        calibrated_by,
        next_due_date,
        notes,
        timestamp
      FROM dbo.CalibrationLog
      ORDER BY timestamp DESC
    `;
    return res.json(result.recordset);
  } catch (err) {
    console.error('Error reading calibration logs:', err);
    return res.status(500).send(err.message);
  }
});


/* ─────────────────────────────────────────────────────────────────────────────
   Export the router to be mounted under /api in your main server file
   ──────────────────────────────────────────────────────────────────────────── */
module.exports = router;



