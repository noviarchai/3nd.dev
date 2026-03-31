const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// OAuth config for each app
const OAUTH_CONFIG = {
  notion: {
    client_id: process.env.NOTION_CLIENT_ID,
    client_secret: process.env.NOTION_CLIENT_SECRET,
    redirect_uri: '/api/connected-apps/notion/callback',
    auth_url: 'https://api.notion.com/v1/oauth/authorize',
    scope: 'integrations:read integrations:write'
  },
  slack: {
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    redirect_uri: '/api/connected-apps/slack/callback',
    auth_url: 'https://slack.com/oauth/v2/authorize',
    scope: 'chat:write,channels:read,groups:read,users:read'
  },
  gmail: {
    client_id: process.env.GMAIL_CLIENT_ID,
    client_secret: process.env.GMAIL_CLIENT_SECRET,
    redirect_uri: '/api/connected-apps/gmail/callback',
    auth_url: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly'
  },
  twitter: {
    client_id: process.env.TWITTER_CLIENT_ID,
    client_secret: process.env.TWITTER_CLIENT_SECRET,
    redirect_uri: '/api/connected-apps/twitter/callback',
    auth_url: 'https://twitter.com/i/oauth2/authorize',
    scope: 'tweet.read tweet.write users.read follows.read follows.write'
  },
  discord: {
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    redirect_uri: '/api/connected-apps/discord/callback',
    auth_url: 'https://discord.com/api/oauth2/authorize',
    scope: 'identify guilds.members.read'
  }
};

// Supported apps
const SUPPORTED_APPS = ['airtable', 'notion', 'slack', 'gmail', 'twitter', 'discord'];

// List connected apps
router.get('/', (req, res) => {
  const db = getDb();
  const apps = db.prepare('SELECT * FROM connected_apps WHERE user_id = ?').all(req.user.id);
  
  res.json({ 
    apps: apps.map(app => ({
      id: app.id,
      app_name: app.app_name,
      metadata: app.metadata ? JSON.parse(app.metadata) : {},
      token_expires_at: app.token_expires_at,
      created_at: app.created_at
      // Don't expose tokens
    }))
  });
});

// Get OAuth URL for an app
router.get('/:app_name/oauth-url', (req, res) => {
  const { app_name } = req.params;
  
  if (!SUPPORTED_APPS.includes(app_name)) {
    return res.status(400).json({ error: 'Unsupported app' });
  }
  
  const config = OAUTH_CONFIG[app_name];
  if (!config || !config.client_id) {
    return res.status(400).json({ error: 'OAuth not configured for this app' });
  }

  // Generate state token for CSRF protection
  const state = uuidv4();
  
  // Store state in session/db for validation
  const db = getDb();
  // We'll use a simple approach - pass state and validate on callback
  const callbackUrl = `${req.protocol}://${req.get('host')}${config.redirect_uri}`;
  
  const params = new URLSearchParams({
    client_id: config.client_id,
    redirect_uri: callbackUrl,
    scope: config.scope,
    state,
    response_type: 'code'
  });

  const authUrl = `${config.auth_url}?${params.toString()}`;
  
  res.json({ auth_url: authUrl, state });
});

// OAuth callback handlers
router.get('/notion/callback', async (req, res) => {
  // Simplified - in production, exchange code for token
  res.redirect('/dashboard/apps?connected=notion');
});

router.get('/slack/callback', async (req, res) => {
  res.redirect('/dashboard/apps?connected=slack');
});

router.get('/gmail/callback', async (req, res) => {
  res.redirect('/dashboard/apps?connected=gmail');
});

router.get('/twitter/callback', async (req, res) => {
  res.redirect('/dashboard/apps?connected=twitter');
});

router.get('/discord/callback', async (req, res) => {
  res.redirect('/dashboard/apps?connected=discord');
});

// Connect app (manual token entry for Airtable PAT, etc)
router.post('/', (req, res) => {
  const { app_name, access_token, refresh_token, metadata } = req.body;
  
  if (!app_name || !access_token) {
    return res.status(400).json({ error: 'app_name and access_token are required' });
  }
  
  if (!SUPPORTED_APPS.includes(app_name)) {
    return res.status(400).json({ error: 'Unsupported app' });
  }

  const db = getDb();
  
  // Check if already connected
  const existing = db.prepare('SELECT id FROM connected_apps WHERE user_id = ? AND app_name = ?').get(req.user.id, app_name);
  if (existing) {
    // Update existing
    db.prepare(`
      UPDATE connected_apps SET 
        access_token = ?, 
        refresh_token = COALESCE(?, refresh_token),
        metadata = COALESCE(?, metadata),
        token_expires_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND app_name = ?
    `).run(access_token, refresh_token, metadata ? JSON.stringify(metadata) : null, req.user.id, app_name);
    
    return res.json({ message: `${app_name} updated`, app_id: existing.id });
  }

  const appId = uuidv4();
  
  db.prepare(`
    INSERT INTO connected_apps (id, user_id, app_name, access_token, refresh_token, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(appId, req.user.id, app_name, access_token, refresh_token || null, metadata ? JSON.stringify(metadata) : null);

  res.status(201).json({ message: `${app_name} connected`, app_id: appId });
});

// Disconnect app
router.delete('/:id', (req, res) => {
  const db = getDb();
  const app = db.prepare('SELECT * FROM connected_apps WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  
  if (!app) {
    return res.status(404).json({ error: 'Connected app not found' });
  }

  db.prepare('DELETE FROM connected_apps WHERE id = ?').run(req.params.id);

  res.json({ message: `${app.app_name} disconnected` });
});

// Check app health
router.get('/:app_name/health', (req, res) => {
  const db = getDb();
  const app = db.prepare('SELECT * FROM connected_apps WHERE user_id = ? AND app_name = ?').get(req.user.id, req.params.app_name);
  
  if (!app) {
    return res.status(404).json({ error: 'App not connected', healthy: false });
  }

  // Simple health check - in production, test the actual API
  const isHealthy = app.token_expires_at ? new Date(app.token_expires_at) > new Date() : true;
  
  res.json({ 
    app_name: app.app_name,
    healthy: isHealthy,
    token_expires_at: app.token_expires_at 
  });
});

module.exports = router;
