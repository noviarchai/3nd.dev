const express = require('express');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { getDb } = require('../db');

const router = express.Router();

// Inbound webhook from external services
router.post('/:endpoint_path', (req, res) => {
  const { endpoint_path } = req.params;
  
  const db = getDb();
  
  // Find webhook endpoint
  const endpoint = db.prepare(`
    SELECT we.*, w.id as w_id, w.user_id as w_user_id, w.name as w_name, w.description as w_description,
           w.trigger_app, w.trigger_type, w.trigger_config as w_trigger_config, w.actions as w_actions,
           w.is_active as w_is_active, w.is_test as w_is_test, w.total_runs as w_total_runs,
           w.last_run_at as w_last_run_at, w.created_at as w_created_at, w.updated_at as w_updated_at,
           u.id as user_id
    FROM webhook_endpoints we
    JOIN workflows w ON we.workflow_id = w.id
    JOIN users u ON w.user_id = u.id
    WHERE we.endpoint_path = ? AND we.is_active = 1
  `).get(endpoint_path);
  
  if (!endpoint) {
    return res.status(404).json({ error: 'Webhook endpoint not found' });
  }
  
  // Verify webhook signature if secret is set
  if (endpoint.secret_key) {
    const signature = req.headers['x-flowforge-signature'];
    const timestamp = req.headers['x-flowforge-timestamp'];
    
    if (!signature || !timestamp) {
      return res.status(401).json({ error: 'Missing signature' });
    }
    
    const expectedSig = crypto
      .createHmac('sha256', endpoint.secret_key)
      .update(`${timestamp}.${JSON.stringify(req.body)}`)
      .digest('hex');
    
    if (signature !== expectedSig) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
  }
  
  // Execute the workflow
  const executionEngine = require('../services/execution-engine');
  const workflow = {
    ...endpoint,
    trigger_config: JSON.parse(endpoint.w_trigger_config || '{}'),
    actions: JSON.parse(endpoint.w_actions || '[]')
  };
  
  // Async execution, don't block response
  executionEngine.executeWorkflow(workflow, req.body, false).catch(err => {
    console.error('Webhook execution error:', err);
  });
  
  res.status(200).json({ received: true });
});

// List user's webhook endpoints
router.get('/', (req, res) => {
  // This would need auth, but it's mounted after /webhook
  // so this is actually the user's webhook list
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const jwt = require('jsonwebtoken');
  const { JWT_SECRET } = require('../middleware/auth');
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const db = getDb();
    const webhooks = db.prepare(`
      SELECT we.*, w.name as workflow_name
      FROM webhook_endpoints we
      LEFT JOIN workflows w ON we.workflow_id = w.id
      WHERE we.user_id = ?
      ORDER BY we.created_at DESC
    `).all(decoded.id);
    
    res.json({ webhooks });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Create webhook endpoint
router.post('/', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const jwt = require('jsonwebtoken');
  const { JWT_SECRET } = require('../middleware/auth');
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const { workflow_id } = req.body;
    
    if (!workflow_id) {
      return res.status(400).json({ error: 'workflow_id is required' });
    }
    
    const db = getDb();
    
    // Verify workflow belongs to user
    const workflow = db.prepare('SELECT * FROM workflows WHERE id = ? AND user_id = ?').get(req.body.workflow_id, decoded.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    // Generate unique endpoint path
    const endpointPath = `wh_${uuidv4().replace(/-/g, '').substring(0, 16)}`;
    const secretKey = crypto.randomBytes(32).toString('hex');
    
    const webhookId = uuidv4();
    
    db.prepare(`
      INSERT INTO webhook_endpoints (id, user_id, workflow_id, endpoint_path, secret_key)
      VALUES (?, ?, ?, ?, ?)
    `).run(webhookId, decoded.id, workflow_id, endpointPath, secretKey);
    
    res.status(201).json({
      message: 'Webhook endpoint created',
      webhook: {
        id: webhookId,
        endpoint_path: endpointPath,
        webhook_url: `/webhook/${endpointPath}`,
        secret_key: secretKey
      }
    });
  } catch (err) {
    console.error('Webhook creation error:', err);
    res.status(500).json({ error: 'Failed to create webhook' });
  }
});

// Delete webhook
router.delete('/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const jwt = require('jsonwebtoken');
  const { JWT_SECRET } = require('../middleware/auth');
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const db = getDb();
    const webhook = db.prepare('SELECT * FROM webhook_endpoints WHERE id = ? AND user_id = ?').get(req.params.id, decoded.id);
    
    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }
    
    db.prepare('DELETE FROM webhook_endpoints WHERE id = ?').run(req.params.id);
    
    res.json({ message: 'Webhook deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete webhook' });
  }
});

module.exports = router;
