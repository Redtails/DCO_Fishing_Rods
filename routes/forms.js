// routes/forms.js

const express = require('express');
const sql     = require('mssql');
const config  = require('../db/config');

const router = express.Router();

// 1) Defect Entry
router.post('/defect-entry', async (req, res) => {
  const { batchNumber, defectType, shift, technicianId, notes } = req.body;

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.DefectReport 
        (batch_id, defect_type, shift, technician_id, notes, timestamp)
      VALUES 
        (${batchNumber}, ${defectType}, ${shift}, ${technicianId}, ${notes}, GETDATE())
    `;
    return res.status(200).send('✅ Defect entry saved');
  }
  catch (err) {
    console.error('Error inserting defect:', err);
    return res.status(500).send(err.message);
  }
});

// 2) Inventory Update
//    –– The InventoryRecord table has columns: 
//       record_id (PK), item_id, quantity, reason_code, staff_id, timestamp
//
//    The front‐end must send a JSON body like:
//      { itemId: "RD-1001", quantity: 5, reasonCode: "Stock Count", staffId: 2 }
router.post('/inventory-update', async (req, res) => {
  const { itemId, quantity, reasonCode, staffId } = req.body;

  // Basic server‐side validation:
  if (
    typeof itemId !== 'string'   || itemId.trim() === '' ||
    typeof quantity !== 'number' || isNaN(quantity)       ||
    typeof reasonCode !== 'string' || reasonCode.trim() === '' ||
    typeof staffId !== 'number'   || isNaN(staffId)
  ) {
    return res.status(400).send('❗ Invalid inventory‐update payload');
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
  }
  catch (err) {
    console.error('Error updating inventory:', err);
    return res.status(500).send(err.message);
  }
});

// 3) Inspection Report
router.post('/inspection-report', async (req, res) => {
  const { batchId, shift, inspectorId, findings } = req.body;

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.InspectionReport 
        (batch_id, shift, inspector_id, findings, timestamp)
      VALUES 
        (${batchId}, ${shift}, ${inspectorId}, ${findings}, GETDATE())
    `;
    return res.status(200).send('✅ Inspection report saved');
  }
  catch (err) {
    console.error('Error saving inspection report:', err);
    return res.status(500).send(err.message);
  }
});

// 4) Work Order Submission
router.post('/work-order', async (req, res) => {
  const { workOrderNo, description, createdBy } = req.body;

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.WorkOrder 
        (work_order_no, description, created_by, timestamp)
      VALUES 
        (${workOrderNo}, ${description}, ${createdBy}, GETDATE())
    `;
    return res.status(200).send('✅ Work order saved');
  }
  catch (err) {
    console.error('Error saving work order:', err);
    return res.status(500).send(err.message);
  }
});

// 5) Maintenance Request
router.post('/maintenance-request', async (req, res) => {
  const { equipmentId, issueDescription, requestedBy } = req.body;

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.MaintenanceRequest 
        (equipment_id, issue_description, requested_by, timestamp)
      VALUES 
        (${equipmentId}, ${issueDescription}, ${requestedBy}, GETDATE())
    `;
    return res.status(200).send('✅ Maintenance request saved');
  }
  catch (err) {
    console.error('Error saving maintenance request:', err);
    return res.status(500).send(err.message);
  }
});

// 6) Calibration Log Entry
router.post('/calibration-log', async (req, res) => {
  const { equipmentId, calibrationDate, calibratedBy, nextDueDate, notes } = req.body;

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.CalibrationLog 
        (equipment_id, calibration_date, calibrated_by, next_due_date, notes, timestamp)
      VALUES 
        (${equipmentId}, ${calibrationDate}, ${calibratedBy}, ${nextDueDate}, ${notes}, GETDATE())
    `;
    return res.status(200).send('✅ Calibration log entry saved');
  }
  catch (err) {
    console.error('Error saving calibration log:', err);
    return res.status(500).send(err.message);
  }
});

module.exports = router;



