const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');
const executionEngine = require('../services/execution-engine');

const router = express.Router();
router.use(authMiddleware);

// List workflows
router.get('/', (req, res) => {
  const db = getDb();
  const workflows = db.prepare(`
    SELECT * FROM workflows WHERE user_id = ? ORDER BY created_at DESC
  `).all(req.user.id);
  
  res.json({ workflows: workflows.map(w => ({
    ...w,
    trigger_config: w.trigger_config ? JSON.parse(w.trigger_config) : {},
    actions: w.actions ? JSON.parse(w.actions) : [],
    is_active: !!w.is_active,
    is_test: !!w.is_test
  }))});
});

// Get single workflow
router.get('/:id', (req, res) => {
  const db = getDb();
  const workflow = db.prepare(`
    SELECT * FROM workflows WHERE id = ? AND user_id = ?
  `).get(req.params.id, req.user.id);
  
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  
  res.json({
    workflow: {
      ...workflow,
      trigger_config: workflow.trigger_config ? JSON.parse(workflow.trigger_config) : {},
      actions: workflow.actions ? JSON.parse(workflow.actions) : [],
      is_active: !!workflow.is_active,
      is_test: !!workflow.is_test
    }
  });
});

// Create workflow
router.post('/', (req, res) => {
  const { name, description, trigger_app, trigger_type, trigger_config, actions } = req.body;
  
  if (!name || !trigger_app || !trigger_type) {
    return res.status(400).json({ error: 'Name, trigger_app, and trigger_type are required' });
  }

  // Check workflow limits by plan
  const limits = { free: 3, starter: 15, pro: 50 };
  const maxWorkflows = limits[req.user.plan_tier] || 3;
  
  const db = getDb();
  const userWorkflows = db.prepare('SELECT COUNT(*) as count FROM workflows WHERE user_id = ?').get(req.user.id);
  
  if (userWorkflows.count >= maxWorkflows) {
    return res.status(403).json({ 
      error: `Workflow limit reached for ${req.user.plan_tier} plan. Upgrade to create more.`,
      plan_limit: maxWorkflows
    });
  }

  const workflowId = uuidv4();
  
  db.prepare(`
    INSERT INTO workflows (id, user_id, name, description, trigger_app, trigger_type, trigger_config, actions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    workflowId,
    req.user.id,
    name,
    description || '',
    trigger_app,
    trigger_type,
    JSON.stringify(trigger_config || {}),
    JSON.stringify(actions || [])
  );

  const workflow = db.prepare('SELECT * FROM workflows WHERE id = ?').get(workflowId);
  
  res.status(201).json({
    message: 'Workflow created',
    workflow: {
      ...workflow,
      trigger_config: JSON.parse(workflow.trigger_config || '{}'),
      actions: JSON.parse(workflow.actions || '[]'),
      is_active: !!workflow.is_active,
      is_test: !!workflow.is_test
    }
  });
});

// Update workflow
router.put('/:id', (req, res) => {
  const { name, description, trigger_app, trigger_type, trigger_config, actions, is_active } = req.body;
  
  const db = getDb();
  const workflow = db.prepare('SELECT * FROM workflows WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }

  db.prepare(`
    UPDATE workflows SET
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      trigger_app = COALESCE(?, trigger_app),
      trigger_type = COALESCE(?, trigger_type),
      trigger_config = COALESCE(?, trigger_config),
      actions = COALESCE(?, actions),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(
    name,
    description,
    trigger_app,
    trigger_type,
    trigger_config ? JSON.stringify(trigger_config) : null,
    actions ? JSON.stringify(actions) : null,
    is_active !== undefined ? (is_active ? 1 : 0) : null,
    req.params.id,
    req.user.id
  );

  const updated = db.prepare('SELECT * FROM workflows WHERE id = ?').get(req.params.id);
  
  res.json({
    message: 'Workflow updated',
    workflow: {
      ...updated,
      trigger_config: JSON.parse(updated.trigger_config || '{}'),
      actions: JSON.parse(updated.actions || '[]'),
      is_active: !!updated.is_active,
      is_test: !!updated.is_test
    }
  });
});

// Delete workflow
router.delete('/:id', (req, res) => {
  const db = getDb();
  const workflow = db.prepare('SELECT * FROM workflows WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }

  // Delete associated execution logs
  db.prepare('DELETE FROM execution_logs WHERE workflow_id = ?').run(req.params.id);
  // Delete webhook endpoints
  db.prepare('DELETE FROM webhook_endpoints WHERE workflow_id = ?').run(req.params.id);
  // Delete workflow
  db.prepare('DELETE FROM workflows WHERE id = ?').run(req.params.id);

  res.json({ message: 'Workflow deleted' });
});

// Test workflow (dry run)
router.post('/:id/test', async (req, res) => {
  const db = getDb();
  const workflow = db.prepare('SELECT * FROM workflows WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }

  try {
    const result = await executionEngine.executeWorkflow(workflow, req.body.test_data || {}, true);
    res.json({ message: 'Test completed', result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Toggle workflow active/inactive
router.post('/:id/toggle', (req, res) => {
  const db = getDb();
  const workflow = db.prepare('SELECT * FROM workflows WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }

  const newStatus = workflow.is_active ? 0 : 1;
  db.prepare('UPDATE workflows SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus, req.params.id);

  res.json({ message: `Workflow ${newStatus ? 'activated' : 'deactivated'}`, is_active: !!newStatus });
});

module.exports = router;
