const express = require('express');
const { getDb } = require('../db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Admin login (separate from user auth)
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ? AND is_admin = 1').get(email);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }
  
  const bcrypt = require('bcryptjs');
  bcrypt.compare(password, user.password_hash, (err, valid) => {
    if (err || !valid) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user.id, email: user.email, is_admin: true },
      process.env.JWT_SECRET || 'flowforge-secret-key-change-in-production',
      { expiresIn: '24h' }
    );
    
    res.json({ token, admin: { id: user.id, email: user.email, name: user.name } });
  });
});

// All routes below require admin auth
router.use(authMiddleware, adminMiddleware);

// Dashboard stats
router.get('/stats', (req, res) => {
  const db = getDb();
  
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const totalWorkflows = db.prepare('SELECT COUNT(*) as count FROM workflows').get().count;
  const totalExecutions = db.prepare('SELECT COUNT(*) as count FROM execution_logs').get().count;
  const activeWorkflows = db.prepare('SELECT COUNT(*) as count FROM workflows WHERE is_active = 1').get().count;
  
  const recentExecutions = db.prepare(`
    SELECT el.*, u.email as user_email, w.name as workflow_name
    FROM execution_logs el
    JOIN users u ON el.user_id = u.id
    JOIN workflows w ON el.workflow_id = w.id
    ORDER BY el.created_at DESC
    LIMIT 10
  `).all();
  
  const planDistribution = db.prepare(`
    SELECT plan_tier, COUNT(*) as count 
    FROM users 
    GROUP BY plan_tier
  `).all();
  
  res.json({
    stats: {
      total_users: totalUsers,
      total_workflows: totalWorkflows,
      total_executions: totalExecutions,
      active_workflows: activeWorkflows,
      plan_distribution: planDistribution
    },
    recent_executions: recentExecutions.map(e => ({
      ...e,
      action_results: e.action_results ? JSON.parse(e.action_results) : null
    }))
  });
});

// List all users
router.get('/users', (req, res) => {
  const db = getDb();
  const { limit = 50, offset = 0, search } = req.query;
  
  let query = 'SELECT id, email, name, plan_tier, executions_used, exec_limit, is_admin, created_at FROM users';
  const params = [];
  
  if (search) {
    query += ' WHERE email LIKE ? OR name LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  const users = db.prepare(query).all(...params);
  const { total } = db.prepare('SELECT COUNT(*) as total FROM users').get();
  
  res.json({ users, total, limit: parseInt(limit), offset: parseInt(offset) });
});

// Get user details
router.get('/users/:id', (req, res) => {
  const db = getDb();
  const user = db.prepare(`
    SELECT id, email, name, plan_tier, executions_used, exec_limit, is_admin, 
           stripe_customer_id, stripe_subscription_id, created_at, updated_at
    FROM users WHERE id = ?
  `).get(req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const workflows = db.prepare('SELECT * FROM workflows WHERE user_id = ?').all(req.params.id);
  const recentExecutions = db.prepare(`
    SELECT el.*, w.name as workflow_name
    FROM execution_logs el
    JOIN workflows w ON el.workflow_id = w.id
    WHERE el.user_id = ?
    ORDER BY el.created_at DESC
    LIMIT 20
  `).all(req.params.id);
  
  res.json({ user, workflows, recent_executions: recentExecutions });
});

// Update user plan
router.put('/users/:id/plan', (req, res) => {
  const { plan_tier, exec_limit } = req.body;
  
  const db = getDb();
  db.prepare(`
    UPDATE users SET 
      plan_tier = COALESCE(?, plan_tier),
      exec_limit = COALESCE(?, exec_limit),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(plan_tier, exec_limit, req.params.id);
  
  res.json({ message: 'User plan updated' });
});

// List all workflows
router.get('/workflows', (req, res) => {
  const db = getDb();
  const { limit = 50, offset = 0, is_active, user_id } = req.query;
  
  let query = `
    SELECT w.*, u.email as user_email
    FROM workflows w
    JOIN users u ON w.user_id = u.id
    WHERE 1=1
  `;
  const params = [];
  
  if (is_active !== undefined) {
    query += ' AND w.is_active = ?';
    params.push(is_active === 'true' ? 1 : 0);
  }
  
  if (user_id) {
    query += ' AND w.user_id = ?';
    params.push(user_id);
  }
  
  query += ' ORDER BY w.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  const workflows = db.prepare(query).all(...params);
  const { total } = db.prepare('SELECT COUNT(*) as total FROM workflows').get();
  
  res.json({ workflows, total, limit: parseInt(limit), offset: parseInt(offset) });
});

// List all executions
router.get('/executions', (req, res) => {
  const db = getDb();
  const { limit = 50, offset = 0, status, workflow_id } = req.query;
  
  let query = `
    SELECT el.*, u.email as user_email, w.name as workflow_name
    FROM execution_logs el
    JOIN users u ON el.user_id = u.id
    JOIN workflows w ON el.workflow_id = w.id
    WHERE 1=1
  `;
  const params = [];
  
  if (status) {
    query += ' AND el.status = ?';
    params.push(status);
  }
  
  if (workflow_id) {
    query += ' AND el.workflow_id = ?';
    params.push(workflow_id);
  }
  
  query += ' ORDER BY el.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  const executions = db.prepare(query).all(...params);
  const { total } = db.prepare('SELECT COUNT(*) as total FROM execution_logs').get();
  
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

// Integration health
router.get('/integrations', (req, res) => {
  const db = getDb();
  
  const integrationStats = db.prepare(`
    SELECT app_name, COUNT(*) as connections, 
           (SELECT COUNT(*) FROM connected_apps WHERE app_name = ca.app_name AND token_expires_at > datetime('now')) as healthy
    FROM connected_apps ca
    GROUP BY app_name
  `).all();
  
  const workflowByTrigger = db.prepare(`
    SELECT trigger_app, COUNT(*) as count
    FROM workflows
    GROUP BY trigger_app
  `).all();
  
  res.json({ 
    integration_stats: integrationStats,
    workflows_by_trigger: workflowByTrigger
  });
});

// Billing overview
router.get('/billing', (req, res) => {
  const db = getDb();
  
  const revenueByPlan = db.prepare(`
    SELECT plan_tier, COUNT(*) as subscribers
    FROM users
    WHERE plan_tier != 'free'
    GROUP BY plan_tier
  `).all();
  
  const planPrices = { starter: 19, pro: 49, business: 99 };
  let mrr = 0;
  revenueByPlan.forEach(r => {
    mrr += (planPrices[r.plan_tier] || 0) * r.subscribers;
  });
  
  res.json({
    mrr,
    revenue_by_plan: revenueByPlan,
    total_paying: revenueByPlan.reduce((sum, r) => sum + r.subscribers, 0)
  });
});

module.exports = router;
