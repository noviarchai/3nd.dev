const express = require('express');
const { getDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// List executions
router.get('/', (req, res) => {
  const db = getDb();
  const { workflow_id, status, limit = 50, offset = 0 } = req.query;
  
  let query = `
    SELECT el.*, w.name as workflow_name 
    FROM execution_logs el
    LEFT JOIN workflows w ON el.workflow_id = w.id
    WHERE el.user_id = ?
  `;
  const params = [req.user.id];
  
  if (workflow_id) {
    query += ' AND el.workflow_id = ?';
    params.push(workflow_id);
  }
  
  if (status) {
    query += ' AND el.status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY el.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  const executions = db.prepare(query).all(...params);
  
  // Get total count
  let countQuery = `SELECT COUNT(*) as total FROM execution_logs WHERE user_id = ?`;
  const countParams = [req.user.id];
  
  if (workflow_id) {
    countQuery += ' AND workflow_id = ?';
    countParams.push(workflow_id);
  }
  if (status) {
    countQuery += ' AND status = ?';
    countParams.push(status);
  }
  
  const { total } = db.prepare(countQuery).get(...countParams);

  res.json({ 
    executions: executions.map(e => ({
      ...e,
      trigger_data: e.trigger_data ? JSON.parse(e.trigger_data) : null,
      action_results: e.action_results ? JSON.parse(e.action_results) : null
    })),
    total,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
});

// Get single execution
router.get('/:id', (req, res) => {
  const db = getDb();
  const execution = db.prepare(`
    SELECT el.*, w.name as workflow_name 
    FROM execution_logs el
    LEFT JOIN workflows w ON el.workflow_id = w.id
    WHERE el.id = ? AND el.user_id = ?
  `).get(req.params.id, req.user.id);
  
  if (!execution) {
    return res.status(404).json({ error: 'Execution not found' });
  }
  
  res.json({
    execution: {
      ...execution,
      trigger_data: execution.trigger_data ? JSON.parse(execution.trigger_data) : null,
      action_results: execution.action_results ? JSON.parse(execution.action_results) : null
    }
  });
});

// Retry failed execution
router.post('/:id/retry', (req, res) => {
  const db = getDb();
  const execution = db.prepare(`
    SELECT el.*, w.* 
    FROM execution_logs el
    LEFT JOIN workflows w ON el.workflow_id = w.id
    WHERE el.id = ? AND el.user_id = ?
  `).get(req.params.id, req.user.id);
  
  if (!execution) {
    return res.status(404).json({ error: 'Execution not found' });
  }
  
  if (execution.status !== 'error') {
    return res.status(400).json({ error: 'Can only retry failed executions' });
  }

  // Re-execute with the original trigger data
  const executionEngine = require('../services/execution-engine');
  
  try {
    const result = executionEngine.executeWorkflow(execution, JSON.parse(execution.trigger_data || '{}'), false);
    res.json({ message: 'Retry initiated', result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
