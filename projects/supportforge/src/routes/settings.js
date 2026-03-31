const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get workspace settings
router.get('/', authenticateToken, (req, res) => {
  try {
    let settings = db.prepare('SELECT * FROM settings WHERE workspace_id = ?')
      .get(req.user.workspace_id);

    if (!settings) {
      const id = uuidv4();
      db.prepare(`
        INSERT INTO settings (id, workspace_id) VALUES (?, ?)
      `).run(id, req.user.workspace_id);
      settings = db.prepare('SELECT * FROM settings WHERE workspace_id = ?')
        .get(req.user.workspace_id);
    }

    const workspace = db.prepare(`
      SELECT id, name, slug, plan, subscription_status FROM workspaces WHERE id = ?
    `).get(req.user.workspace_id);

    res.json({ ...settings, workspace });
  } catch (err) {
    console.error('Get settings error:', err);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// Update workspace settings
router.put('/', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update settings' });
    }

    const { 
      workspaceName, 
      widgetColor, 
      widgetPosition, 
      welcomeMessage,
      businessHours,
      timezone,
      emailIntegrationEnabled,
      chatbotEnabled
    } = req.body;

    // Update workspace name if provided
    if (workspaceName) {
      db.prepare('UPDATE workspaces SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(workspaceName, req.user.workspace_id);
    }

    // Update settings
    const updates = [];
    const params = [];

    if (widgetColor) { updates.push('widget_color = ?'); params.push(widgetColor); }
    if (widgetPosition) { updates.push('widget_position = ?'); params.push(widgetPosition); }
    if (welcomeMessage !== undefined) { updates.push('welcome_message = ?'); params.push(welcomeMessage); }
    if (businessHours !== undefined) { updates.push('business_hours = ?'); params.push(businessHours); }
    if (timezone) { updates.push('timezone = ?'); params.push(timezone); }
    if (emailIntegrationEnabled !== undefined) { updates.push('email_integration_enabled = ?'); params.push(emailIntegrationEnabled ? 1 : 0); }
    if (chatbotEnabled !== undefined) { updates.push('chatbot_enabled = ?'); params.push(chatbotEnabled ? 1 : 0); }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(req.user.workspace_id);
      
      db.prepare(`UPDATE settings SET ${updates.join(', ')} WHERE workspace_id = ?`).run(...params);
    }

    const settings = db.prepare('SELECT * FROM settings WHERE workspace_id = ?')
      .get(req.user.workspace_id);

    res.json({ success: true, settings });
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get canned responses
router.get('/canned-responses', authenticateToken, (req, res) => {
  try {
    const responses = db.prepare(`
      SELECT cr.*, u.name as author_name
      FROM canned_responses cr
      LEFT JOIN users u ON cr.user_id = u.id
      WHERE cr.workspace_id = ?
      ORDER BY cr.title ASC
    `).all(req.user.workspace_id);

    res.json({ responses });
  } catch (err) {
    console.error('Get canned responses error:', err);
    res.status(500).json({ error: 'Failed to get canned responses' });
  }
});

// Create canned response
router.post('/canned-responses', authenticateToken, (req, res) => {
  try {
    const { shortcut, content, title } = req.body;

    if (!shortcut || !content) {
      return res.status(400).json({ error: 'Shortcut and content are required' });
    }

    const existing = db.prepare('SELECT id FROM canned_responses WHERE workspace_id = ? AND shortcut = ?')
      .get(req.user.workspace_id, shortcut);

    if (existing) {
      return res.status(400).json({ error: 'Shortcut already exists' });
    }

    const id = uuidv4();
    db.prepare(`
      INSERT INTO canned_responses (id, workspace_id, user_id, shortcut, content, title)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, req.user.workspace_id, req.user.id, shortcut, content, title || shortcut);

    const response = db.prepare('SELECT * FROM canned_responses WHERE id = ?').get(id);
    res.json({ success: true, response });
  } catch (err) {
    console.error('Create canned response error:', err);
    res.status(500).json({ error: 'Failed to create canned response' });
  }
});

// Delete canned response
router.delete('/canned-responses/:id', authenticateToken, (req, res) => {
  try {
    const response = db.prepare('SELECT * FROM canned_responses WHERE id = ? AND workspace_id = ?')
      .get(req.params.id, req.user.workspace_id);

    if (!response) {
      return res.status(404).json({ error: 'Canned response not found' });
    }

    db.prepare('DELETE FROM canned_responses WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete canned response error:', err);
    res.status(500).json({ error: 'Failed to delete canned response' });
  }
});

// Get widget configuration (public - for chat widget)
router.get('/widget/:workspaceId', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM settings WHERE workspace_id = ?')
      .get(req.params.workspaceId);

    const workspace = db.prepare(`
      SELECT id, name, plan FROM workspaces WHERE id = ? AND subscription_status IN ('active', 'trial')
    `).get(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found or inactive' });
    }

    res.json({
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      widgetColor: settings?.widget_color || '#6366f1',
      widgetPosition: settings?.widget_position || 'right',
      welcomeMessage: settings?.welcome_message || 'Hi there! How can we help you today?',
      businessHours: settings?.business_hours,
      timezone: settings?.timezone || 'America/Edmonton'
    });
  } catch (err) {
    console.error('Get widget config error:', err);
    res.status(500).json({ error: 'Failed to get widget configuration' });
  }
});

module.exports = router;
