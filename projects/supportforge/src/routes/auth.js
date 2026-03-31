const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', (req, res) => {
  try {
    const { email, password, name, workspaceName } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const workspaceId = uuidv4();
    const userId = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const slug = (workspaceName || name).toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString(36);

    // Create workspace
    db.prepare(`
      INSERT INTO workspaces (id, name, slug, plan, subscription_status)
      VALUES (?, ?, ?, 'trial', 'active')
    `).run(workspaceId, workspaceName || `${name}'s Workspace`, slug);

    // Create user
    db.prepare(`
      INSERT INTO users (id, workspace_id, email, password_hash, name, role)
      VALUES (?, ?, ?, ?, ?, 'admin')
    `).run(userId, workspaceId, email, hashedPassword, name);

    // Create default settings
    db.prepare(`
      INSERT INTO settings (id, workspace_id)
      VALUES (?, ?)
    `).run(uuidv4(), workspaceId);

    // Generate token
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ 
      success: true, 
      user: { id: userId, email, name, role: 'admin' },
      workspace: { id: workspaceId, name: workspaceName || `${name}'s Workspace` },
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare(`
      SELECT u.*, w.name as workspace_name, w.slug as workspace_slug, w.plan, w.subscription_status
      FROM users u
      JOIN workspaces w ON u.workspace_id = w.id
      WHERE u.email = ?
    `).get(email);

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        workspaceId: user.workspace_id,
        avatarUrl: user.avatar_url
      },
      workspace: {
        id: user.workspace_id,
        name: user.workspace_name,
        slug: user.workspace_slug,
        plan: user.plan,
        subscriptionStatus: user.subscription_status
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  const workspace = db.prepare(`
    SELECT id, name, slug, plan, subscription_status, stripe_customer_id
    FROM workspaces WHERE id = ?
  `).get(req.user.workspace_id);

  res.json({
    user: req.user,
    workspace
  });
});

// Invite team member
router.post('/invite', authenticateToken, (req, res) => {
  try {
    const { email, role = 'agent' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can invite team members' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    db.prepare(`
      INSERT INTO invitations (id, workspace_id, email, token, role, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), req.user.workspace_id, email, token, role, expiresAt);

    const inviteLink = `${process.env.APP_URL}/invite/${token}`;

    res.json({ 
      success: true, 
      inviteLink,
      token,
      expiresAt
    });
  } catch (err) {
    console.error('Invite error:', err);
    res.status(500).json({ error: 'Failed to create invitation' });
  }
});

// Accept invitation
router.post('/invite/accept', (req, res) => {
  try {
    const { token, password, name } = req.body;

    if (!token || !password || !name) {
      return res.status(400).json({ error: 'Token, password, and name are required' });
    }

    const invitation = db.prepare(`
      SELECT * FROM invitations WHERE token = ? AND expires_at > datetime('now')
    `).get(token);

    if (!invitation) {
      return res.status(400).json({ error: 'Invalid or expired invitation' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(invitation.email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const userId = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.prepare(`
      INSERT INTO users (id, workspace_id, email, password_hash, name, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, invitation.workspace_id, invitation.email, hashedPassword, name, invitation.role);

    // Delete invitation
    db.prepare('DELETE FROM invitations WHERE token = ?').run(token);

    const tokenJwt = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', tokenJwt, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, token: tokenJwt });
  } catch (err) {
    console.error('Accept invite error:', err);
    res.status(500).json({ error: 'Failed to accept invitation' });
  }
});

// Get team members
router.get('/team', authenticateToken, (req, res) => {
  const members = db.prepare(`
    SELECT id, email, name, role, avatar_url, created_at
    FROM users WHERE workspace_id = ?
  `).all(req.user.workspace_id);

  res.json({ members });
});

// Remove team member
router.delete('/team/:userId', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can remove team members' });
    }

    if (req.params.userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot remove yourself' });
    }

    const member = db.prepare('SELECT * FROM users WHERE id = ? AND workspace_id = ?')
      .get(req.params.userId, req.user.workspace_id);

    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.userId);

    res.json({ success: true });
  } catch (err) {
    console.error('Remove member error:', err);
    res.status(500).json({ error: 'Failed to remove team member' });
  }
});

module.exports = router;
