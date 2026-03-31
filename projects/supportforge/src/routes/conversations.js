const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { notifyCustomer, broadcastConversationUpdate, broadcastToWorkspace } = require('../services/websocket');

const router = express.Router();

// Get all conversations (for agents/admins)
router.get('/', authenticateToken, (req, res) => {
  try {
    const { status, priority, assigned, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT c.*, 
             cust.name as customer_name, cust.email as customer_email,
             u.name as assigned_name,
             (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id) as message_count,
             (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
      FROM conversations c
      LEFT JOIN customers cust ON c.customer_id = cust.id
      LEFT JOIN users u ON c.assigned_to = u.id
      WHERE c.workspace_id = ?
    `;
    const params = [req.user.workspace_id];

    if (status) {
      query += ' AND c.status = ?';
      params.push(status);
    }

    if (priority) {
      query += ' AND c.priority = ?';
      params.push(priority);
    }

    if (assigned === 'me') {
      query += ' AND c.assigned_to = ?';
      params.push(req.user.id);
    } else if (assigned === 'unassigned') {
      query += ' AND c.assigned_to IS NULL';
    }

    query += ' ORDER BY c.updated_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const conversations = db.prepare(query).all(...params);

    const total = db.prepare(`
      SELECT COUNT(*) as count FROM conversations WHERE workspace_id = ?
      ${status ? ' AND status = ?' : ''}
      ${priority ? ' AND priority = ?' : ''}
    `).get(req.user.workspace_id, ...(status ? [status] : []), ...(priority ? [priority] : []));

    res.json({ 
      conversations,
      total: total.count,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// Get single conversation with messages
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const conversation = db.prepare(`
      SELECT c.*, 
             cust.name as customer_name, cust.email as customer_email, cust.metadata as customer_metadata,
             u.name as assigned_name
      FROM conversations c
      LEFT JOIN customers cust ON c.customer_id = cust.id
      LEFT JOIN users u ON c.assigned_to = u.id
      WHERE c.id = ? AND c.workspace_id = ?
    `).get(req.params.id, req.user.workspace_id);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = db.prepare(`
      SELECT m.*, u.name as sender_name
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
    `).all(req.params.id);

    res.json({ conversation, messages });
  } catch (err) {
    console.error('Get conversation error:', err);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
});

// Create conversation (from customer widget)
router.post('/', optionalAuth, (req, res) => {
  try {
    const { workspaceId, customerEmail, customerName, subject, message, metadata } = req.body;

    if (!workspaceId || !message) {
      return res.status(400).json({ error: 'Workspace ID and message are required' });
    }

    // Verify workspace exists
    const workspace = db.prepare('SELECT * FROM workspaces WHERE id = ?').get(workspaceId);
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Find or create customer
    let customer;
    if (customerEmail) {
      customer = db.prepare('SELECT * FROM customers WHERE workspace_id = ? AND email = ?')
        .get(workspaceId, customerEmail);
    }
    
    if (!customer) {
      const customerId = uuidv4();
      db.prepare(`
        INSERT INTO customers (id, workspace_id, email, name, metadata)
        VALUES (?, ?, ?, ?, ?)
      `).run(customerId, workspaceId, customerEmail || null, customerName || 'Anonymous', metadata ? JSON.stringify(metadata) : null);
      customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(customerId);
    }

    // Create conversation
    const conversationId = uuidv4();
    db.prepare(`
      INSERT INTO conversations (id, workspace_id, customer_id, subject, status, priority)
      VALUES (?, ?, ?, ?, 'open', 'normal')
    `).run(conversationId, workspaceId, customer.id, subject || 'New conversation');

    // Add initial message
    const messageId = uuidv4();
    db.prepare(`
      INSERT INTO messages (id, conversation_id, sender_id, sender_type, content, message_type)
      VALUES (?, ?, ?, 'customer', ?, 'text')
    `).run(messageId, conversationId, customer.id, message);

    // Get created conversation
    const conversation = db.prepare(`
      SELECT c.*, cust.name as customer_name, cust.email as customer_email
      FROM conversations c
      LEFT JOIN customers cust ON c.customer_id = cust.id
      WHERE c.id = ?
    `).get(conversationId);

    // Broadcast to agents
    broadcastToWorkspace(workspaceId, {
      type: 'conversation_created',
      conversation
    });

    res.json({ 
      success: true, 
      conversation,
      customerId: customer.id
    });
  } catch (err) {
    console.error('Create conversation error:', err);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Add message to conversation
router.post('/:id/messages', optionalAuth, (req, res) => {
  try {
    const { content, senderId, senderType } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const conversation = db.prepare(`
      SELECT c.*, cust.id as cust_id FROM conversations c
      LEFT JOIN customers cust ON c.customer_id = cust.id
      WHERE c.id = ? AND c.workspace_id = ?
    `).get(req.params.id, req.user?.workspace_id);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messageId = uuidv4();
    const finalSenderId = senderId || req.user?.id || conversation.cust_id;
    const finalSenderType = senderType || (req.user?.role === 'admin' || req.user?.role === 'agent' ? 'agent' : 'customer');

    db.prepare(`
      INSERT INTO messages (id, conversation_id, sender_id, sender_type, content, message_type)
      VALUES (?, ?, ?, ?, ?, 'text')
    `).run(messageId, req.params.id, finalSenderId, finalSenderType, content);

    // Update conversation timestamp
    db.prepare(`
      UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(req.params.id);

    const message = db.prepare(`
      SELECT m.*, u.name as sender_name
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?
    `).get(messageId);

    // Broadcast to all connected clients
    notifyCustomer(req.params.id, message);

    // Also notify workspace for agent dashboard updates
    broadcastToWorkspace(conversation.workspace_id, {
      type: 'message_update',
      conversationId: req.params.id,
      message
    });

    res.json({ success: true, message });
  } catch (err) {
    console.error('Add message error:', err);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

// Update conversation (status, priority, assignee)
router.patch('/:id', authenticateToken, (req, res) => {
  try {
    const { status, priority, assignedTo } = req.body;
    const conversation = db.prepare(`
      SELECT * FROM conversations WHERE id = ? AND workspace_id = ?
    `).get(req.params.id, req.user.workspace_id);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const updates = [];
    const params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
      if (status === 'closed') {
        updates.push('closed_at = CURRENT_TIMESTAMP');
      }
    }
    if (priority) {
      updates.push('priority = ?');
      params.push(priority);
    }
    if (assignedTo !== undefined) {
      updates.push('assigned_to = ?');
      params.push(assignedTo);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.id);

    db.prepare(`UPDATE conversations SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const updated = db.prepare(`
      SELECT c.*, cust.name as customer_name, cust.email as customer_email, u.name as assigned_name
      FROM conversations c
      LEFT JOIN customers cust ON c.customer_id = cust.id
      LEFT JOIN users u ON c.assigned_to = u.id
      WHERE c.id = ?
    `).get(req.params.id);

    broadcastConversationUpdate(req.user.workspace_id, updated);

    res.json({ success: true, conversation: updated });
  } catch (err) {
    console.error('Update conversation error:', err);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
});

// Get conversation stats
router.get('/stats/dashboard', authenticateToken, (req, res) => {
  try {
    const stats = {
      open: db.prepare('SELECT COUNT(*) as count FROM conversations WHERE workspace_id = ? AND status = ?')
        .get(req.user.workspace_id, 'open').count,
      closed: db.prepare('SELECT COUNT(*) as count FROM conversations WHERE workspace_id = ? AND status = ?')
        .get(req.user.workspace_id, 'closed').count,
      pending: db.prepare('SELECT COUNT(*) as count FROM conversations WHERE workspace_id = ? AND status = ?')
        .get(req.user.workspace_id, 'pending').count,
      unassigned: db.prepare('SELECT COUNT(*) as count FROM conversations WHERE workspace_id = ? AND assigned_to IS NULL AND status = ?')
        .get(req.user.workspace_id, 'open').count,
      myConversations: db.prepare('SELECT COUNT(*) as count FROM conversations WHERE workspace_id = ? AND assigned_to = ? AND status = ?')
        .get(req.user.workspace_id, req.user.id, 'open').count,
      avgResponseTime: 0,
      totalCustomers: db.prepare('SELECT COUNT(*) as count FROM customers WHERE workspace_id = ?')
        .get(req.user.workspace_id).count
    };

    res.json(stats);
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

module.exports = router;
