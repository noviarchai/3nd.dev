require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const db = require('./db');
const authRoutes = require('./routes/auth');
const workflowRoutes = require('./routes/workflows');
const connectedAppRoutes = require('./routes/connected-apps');
const executionRoutes = require('./routes/executions');
const billingRoutes = require('./routes/billing');
const webhookRoutes = require('./routes/webhooks');
const adminRoutes = require('./routes/admin');
const stripeWebhookRoutes = require('./routes/stripe-webhook');

const app = express();
const PORT = process.env.PORT || 3847;

// Initialize database
db.initialize();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (compiled React app)
app.use(express.static(path.join(__dirname, '../client/build')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/connected-apps', connectedAppRoutes);
app.use('/api/executions', executionRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stripe', stripeWebhookRoutes);

// Webhook endpoint (inbound from external services)
app.use('/webhook', webhookRoutes);

// Catch-all: serve React app for non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/webhook')) {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FlowForge running on http://0.0.0.0:${PORT}`);
  console.log(`API available at http://0.0.0.0:${PORT}/api`);
});

module.exports = app;
