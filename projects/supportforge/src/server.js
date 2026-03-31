require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { initWebSocket } = require('./services/websocket');

// Import routes
const authRoutes = require('./routes/auth');
const conversationRoutes = require('./routes/conversations');
const billingRoutes = require('./routes/billing');
const settingsRoutes = require('./routes/settings');
const webhookRoutes = require('./routes/webhook');

// Import database
const { initDb } = require('./models/db');

const app = express();
const server = http.createServer(app);

// Initialize WebSocket
initWebSocket(server);

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(cookieParser());

// Stripe webhook needs raw body
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

// JSON parsing for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/settings', settingsRoutes);

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3847;

async function start() {
  // Initialize database first
  await initDb();
  
  server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║     ██████╗ ██████╗ ███╗   ███╗███████╗ ██████╗ ██╗     ║
║    ██╔════╝██╔═══██╗████╗ ████║██╔════╝██╔═══██╗██║     ║
║    ██║     ██║   ██║██╔████╔██║█████╗  ██║   ██║██║     ║
║    ██║     ██║   ██║██║╚██╔╝██║██╔══╝  ██║   ██║╚═╝     ║
║    ╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗╚██████╔╝██╗     ║
║     ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝ ╚═════╝ ╚═╝     ║
║                                                          ║
║    💬 Flat-rate Customer Support SaaS                    ║
║    💰 $49 flat/month • Unlimited seats                   ║
║                                                          ║
║    Server running on port ${PORT}                           ║
║    WebSocket ready on /ws                                 ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = { app, server };
