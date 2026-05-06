const express = require('express');
const { db } = require('../data/init');
const { checkAdmin } = require('../middleware/auth');

const router = express.Router();

// List all tools for browsing (visible to all users regardless of activation)
router.get('/api/browse', (req, res) => {
  const tools = db.prepare('SELECT * FROM tools ORDER BY tool_number ASC').all();
  
  // Get user's activated tool IDs
  const activated = db.prepare('SELECT tool_id FROM tool_activations WHERE user_id = ?').all(req.user.id);
  const activatedIds = activated.map(a => a.tool_id);
  
  // Return all tools with activation status for current user
  const toolsWithStatus = tools.map(t => ({
    ...t,
    is_activated: activatedIds.includes(t.id)
  }));
  
  res.json(toolsWithStatus);
});

// List all tools (admin sees all, founders see activated or auto_activate)
router.get('/api', (req, res) => {
  const tools = db.prepare('SELECT * FROM tools ORDER BY tool_number ASC').all();
  
  // For non-admin, filter based on activation status
  if (req.user.role !== 'admin') {
    const activated = db.prepare('SELECT tool_id FROM tool_activations WHERE user_id = ?').all(req.user.id);
    const activatedIds = activated.map(a => a.tool_id);
    
    const filtered = tools.filter(t => 
      t.auto_activate === 1 || activatedIds.includes(t.id)
    );
    return res.json(filtered);
  }
  
  res.json(tools);
});

// Get user's activated tools
router.get('/api/my-tools', (req, res) => {
  const activated = db.prepare(`
    SELECT t.*, ta.activated_at, ta.last_accessed 
    FROM tool_activations ta 
    JOIN tools t ON ta.tool_id = t.id 
    WHERE ta.user_id = ?
    ORDER BY ta.last_accessed DESC, ta.activated_at DESC
  `).all(req.user.id);
  
  res.json(activated);
});

// Activate a tool for current user
router.post('/api/activate/:id', (req, res) => {
  const tool = db.prepare('SELECT * FROM tools WHERE id = ?').get(req.params.id);
  if (!tool) return res.status(404).json({ error: 'Tool not found' });

  // Check if already activated
  const existing = db.prepare('SELECT * FROM tool_activations WHERE user_id = ? AND tool_id = ?').get(req.user.id, req.params.id);
  
  if (existing) {
    // Update last accessed
    db.prepare('UPDATE tool_activations SET last_accessed = CURRENT_TIMESTAMP WHERE user_id = ? AND tool_id = ?').run(req.user.id, req.params.id);
    return res.json({ success: true, message: 'Already activated', tool });
  }

  // Activate
  db.prepare('INSERT INTO tool_activations (user_id, tool_id) VALUES (?, ?)').run(req.user.id, req.params.id);
  db.prepare('UPDATE tools SET activated_count = activated_count + 1 WHERE id = ?').run(req.params.id);

  // Log
  db.prepare('INSERT INTO activity_log (user_id, tool_id, action, details) VALUES (?, ?, ?, ?)').run(
    req.user.id, req.params.id, 'activate_tool', JSON.stringify({ tool_number: tool.tool_number })
  );

  res.json({ success: true, message: 'Tool activated', tool });
});

// Deactivate a tool
router.post('/api/deactivate/:id', (req, res) => {
  db.prepare('DELETE FROM tool_activations WHERE user_id = ? AND tool_id = ?').run(req.user.id, req.params.id);
  res.json({ success: true, message: 'Tool deactivated' });
});

// Get single tool
router.get('/api/:id', (req, res) => {
  const tool = db.prepare('SELECT * FROM tools WHERE id = ? OR tool_number = ?').get(req.params.id, req.params.id);
  if (!tool) return res.status(404).json({ error: 'Tool not found' });

  // Check if user has access
  if (req.user.role !== 'admin' && tool.requires_activation) {
    const activation = db.prepare('SELECT * FROM tool_activations WHERE user_id = ? AND tool_id = ?').get(req.user.id, tool.id);
    if (!activation && !tool.auto_activate) {
      return res.status(403).json({ error: 'Tool not activated', activation_required: true });
    }
  }

  // Update last used
  db.prepare('UPDATE tools SET last_used = CURRENT_TIMESTAMP WHERE id = ?').run(tool.id);
  db.prepare('UPDATE tool_activations SET last_accessed = CURRENT_TIMESTAMP WHERE user_id = ? AND tool_id = ?').run(req.user.id, tool.id);

  // Log
  db.prepare('INSERT INTO activity_log (user_id, tool_id, action, details) VALUES (?, ?, ?, ?)').run(
    req.user.id, tool.id, 'view', JSON.stringify({ tool_number: tool.tool_number })
  );

  res.json(tool);
});

// Create new tool (admin only)
router.post('/api', checkAdmin, (req, res) => {
  const { name, description, owner, category, notes, repo_link, live_url, requires_activation, auto_activate } = req.body;

  if (!name || !owner) {
    return res.status(400).json({ error: 'Name and owner are required' });
  }

  const toolNumber = db.prepare('SELECT MAX(tool_number) as max FROM tools').get().max || 111110;
  const nextNumber = toolNumber + 1;

  const result = db.prepare(`
    INSERT INTO tools (tool_number, name, description, owner, category, notes, repo_link, live_url, requires_activation, auto_activate, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'idea')
  `).run(
    nextNumber, name, description || '', owner,
    category || 'general', notes || '', repo_link || '',
    live_url || null,
    requires_activation ? 1 : 0,
    auto_activate ? 1 : 0
  );

  const tool = db.prepare('SELECT * FROM tools WHERE id = ?').get(result.lastInsertRowid);

  // Log
  db.prepare('INSERT INTO activity_log (user_id, tool_id, action, details) VALUES (?, ?, ?, ?)').run(
    req.user.id, tool.id, 'create_tool', JSON.stringify({ tool_number: tool.tool_number, name: tool.name })
  );

  res.json({ success: true, tool });
});

// Update tool (admin only)
router.put('/api/:id', checkAdmin, (req, res) => {
  const tool = db.prepare('SELECT * FROM tools WHERE id = ?').get(req.params.id);
  if (!tool) return res.status(404).json({ error: 'Tool not found' });

  const { name, description, owner, category, notes, repo_link, live_url, status, requires_activation, auto_activate } = req.body;

  db.prepare(`
    UPDATE tools SET
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      owner = COALESCE(?, owner),
      category = COALESCE(?, category),
      notes = COALESCE(?, notes),
      repo_link = COALESCE(?, repo_link),
      live_url = COALESCE(?, live_url),
      status = COALESCE(?, status),
      requires_activation = COALESCE(?, requires_activation),
      auto_activate = COALESCE(?, auto_activate)
    WHERE id = ?
  `).run(name, description, owner, category, notes, repo_link, live_url, status, requires_activation, auto_activate, req.params.id);

  const updated = db.prepare('SELECT * FROM tools WHERE id = ?').get(req.params.id);

  // Log
  db.prepare('INSERT INTO activity_log (user_id, tool_id, action, details) VALUES (?, ?, ?, ?)').run(
    req.user.id, tool.id, 'update_tool', JSON.stringify({ tool_number: tool.tool_number })
  );

  res.json({ success: true, tool: updated });
});

module.exports = router;