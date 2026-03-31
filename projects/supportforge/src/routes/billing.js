const express = require('express');
const db = require('../models/db');
const { authenticateToken } = require('../middleware/auth');
const { createCheckoutSession, createBillingPortalSession, getInvoices } = require('../services/stripe');

const router = express.Router();

// Get billing status
router.get('/', authenticateToken, (req, res) => {
  try {
    const workspace = db.prepare(`
      SELECT plan, subscription_status, stripe_customer_id, stripe_subscription_id
      FROM workspaces WHERE id = ?
    `).get(req.user.workspace_id);

    if (!workspace.stripe_customer_id) {
      return res.json({
        plan: workspace.plan,
        subscriptionStatus: workspace.subscription_status,
        hasSubscription: false,
        canUpgrade: true,
        price: 49
      });
    }

    res.json({
      plan: workspace.plan,
      subscriptionStatus: workspace.subscription_status,
      hasSubscription: true,
      canUpgrade: false,
      price: 49,
      customerId: workspace.stripe_customer_id
    });
  } catch (err) {
    console.error('Get billing error:', err);
    res.status(500).json({ error: 'Failed to get billing info' });
  }
});

// Create checkout session
router.post('/checkout', authenticateToken, async (req, res) => {
  try {
    const workspace = db.prepare(`
      SELECT w.*, u.name as owner_name
      FROM workspaces w
      JOIN users u ON w.id = u.workspace_id AND u.role = 'admin'
      WHERE w.id = ?
    `).get(req.user.workspace_id);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    const session = await createCheckoutSession(
      workspace.id,
      req.user.id,
      workspace.name
    );

    res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Create billing portal session
router.post('/portal', authenticateToken, async (req, res) => {
  try {
    const workspace = db.prepare(`
      SELECT stripe_customer_id FROM workspaces WHERE id = ?
    `).get(req.user.workspace_id);

    if (!workspace?.stripe_customer_id) {
      return res.status(400).json({ error: 'No billing account found' });
    }

    const session = await createBillingPortalSession(
      workspace.stripe_customer_id,
      `${process.env.APP_URL}/dashboard`
    );

    res.json({ url: session.url });
  } catch (err) {
    console.error('Portal error:', err);
    res.status(500).json({ error: 'Failed to create billing portal session' });
  }
});

// Get invoices
router.get('/invoices', authenticateToken, async (req, res) => {
  try {
    const workspace = db.prepare(`
      SELECT stripe_customer_id FROM workspaces WHERE id = ?
    `).get(req.user.workspace_id);

    if (!workspace?.stripe_customer_id) {
      return res.json({ invoices: [] });
    }

    const invoices = await getInvoices(workspace.stripe_customer_id);
    
    res.json({
      invoices: invoices.map(inv => ({
        id: inv.id,
        amount: inv.amount_paid / 100,
        currency: inv.currency,
        status: inv.status,
        date: new Date(inv.created * 1000).toISOString(),
        pdf: inv.invoice_pdf,
        number: inv.number
      }))
    });
  } catch (err) {
    console.error('Get invoices error:', err);
    res.status(500).json({ error: 'Failed to get invoices' });
  }
});

// Cancel subscription
router.post('/cancel', authenticateToken, async (req, res) => {
  try {
    const workspace = db.prepare(`
      SELECT stripe_subscription_id FROM workspaces WHERE id = ?
    `).get(req.user.workspace_id);

    if (!workspace?.stripe_subscription_id) {
      return res.status(400).json({ error: 'No active subscription' });
    }

    const { getSubscription } = require('../services/stripe');
    const subscription = await getSubscription(workspace.stripe_subscription_id);
    
    await require('../services/stripe').stripe.subscriptions.update(
      workspace.stripe_subscription_id,
      { cancel_at_period_end: true }
    );

    res.json({ success: true, message: 'Subscription will be canceled at end of billing period' });
  } catch (err) {
    console.error('Cancel subscription error:', err);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

module.exports = router;
