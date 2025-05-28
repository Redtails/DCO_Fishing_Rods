const express = require('express');
const sql = require('mssql');
const config = require('../db/config');

const router = express.Router();

// 1) Defect Entry
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

// 2) Inventory Update
router.post('/inventory-update', async (req, res) => {
  const { itemId, quantity, reasonCode, staffId } = req.body;
  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.InventoryRecord (item_id, quantity, reason_code, staff_id, timestamp)
      VALUES (${itemId}, ${quantity}, ${reasonCode}, ${staffId}, GETDATE())
    `;
    res.status(200).send('Inventory update saved');
  } catch (err) {
    console.error('Error updating inventory:', err);
    res.status(500).send(err.message);
  }
});

// 3) Inspection Report
router.post('/inspection-report', async (req, res) => {
  const { batchId, shift, inspectorId, findings } = req.body;
  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.InspectionReport (batch_id, shift, inspector_id, findings, timestamp)
      VALUES (${batchId}, ${shift}, ${inspectorId}, ${findings}, GETDATE())
    `;
    res.status(200).send('Inspection report saved');
  } catch (err) {
    console.error('Error saving inspection report:', err);
    res.status(500).send(err.message);
  }
});

// 4) Work Order Submission
router.post('/work-order', async (req, res) => {
  const { workOrderNo, description, createdBy } = req.body;
  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.WorkOrder (work_order_no, description, created_by, timestamp)
      VALUES (${workOrderNo}, ${description}, ${createdBy}, GETDATE())
    `;
    res.status(200).send('Work order saved');
  } catch (err) {
    console.error('Error saving work order:', err);
    res.status(500).send(err.message);
  }
});

// 5) Maintenance Request
router.post('/maintenance-request', async (req, res) => {
  const { equipmentId, issueDescription, requestedBy } = req.body;
  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.MaintenanceRequest (equipment_id, issue_description, requested_by, timestamp)
      VALUES (${equipmentId}, ${issueDescription}, ${requestedBy}, GETDATE())
    `;
    res.status(200).send('Maintenance request saved');
  } catch (err) {
    console.error('Error saving maintenance request:', err);
    res.status(500).send(err.message);
  }
});

// 6) Calibration Log Entry
router.post('/calibration-log', async (req, res) => {
  const { equipmentId, calibrationDate, calibratedBy, nextDueDate, notes } = req.body;
  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.CalibrationLog (equipment_id, calibration_date, calibrated_by, next_due_date, notes, timestamp)
      VALUES (${equipmentId}, ${calibrationDate}, ${calibratedBy}, ${nextDueDate}, ${notes}, GETDATE())
    `;
    res.status(200).send('Calibration log entry saved');
  } catch (err) {
    console.error('Error saving calibration log:', err);
    res.status(500).send(err.message);
  }
});

module.exports = router;

