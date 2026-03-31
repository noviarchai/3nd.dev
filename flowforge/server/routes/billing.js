const express = require('express');
const { getDb } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Plan definitions
const PLANS = {
  free: { name: 'Free', price: 0, exec_limit: 500, workflows: 3 },
  starter: { name: 'Starter', price: 19, exec_limit: 5000, workflows: 15 },
  pro: { name: 'Pro', price: 49, exec_limit: 25000, workflows: 50 },
  business: { name: 'Business', price: 99, exec_limit: 100000, workflows: Infinity }
};

// Get available plans
router.get('/plans', (req, res) => {
  res.json({ plans: PLANS });
});

// Get current subscription
router.get('/subscription', (req, res) => {
  const user = req.user;
  const plan = PLANS[user.plan_tier] || PLANS.free;
  
  res.json({
    plan: {
      tier: user.plan_tier,
      name: plan.name,
      price: plan.price,
      exec_limit: plan.exec_limit,
      workflows: plan.workflows
    },
    usage: {
      executions_used: user.executions_used,
      exec_limit: user.exec_limit
    },
    stripe_customer_id: user.stripe_customer_id,
    stripe_subscription_id: user.stripe_subscription_id
  });
});

// Subscribe to a plan (creates Stripe checkout)
router.post('/subscribe', async (req, res) => {
  const { plan_tier } = req.body;
  
  if (!PLANS[plan_tier]) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  const plan = PLANS[plan_tier];
  
  // If no Stripe configured, just update directly
  if (!process.env.STRIPE_SECRET_KEY) {
    const db = getDb();
    db.prepare(`
      UPDATE users SET 
        plan_tier = ?,
        exec_limit = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(plan_tier, plan.exec_limit, req.user.id);
    
    return res.json({ 
      message: `Subscribed to ${plan.name}`,
      plan_tier,
      exec_limit: plan.exec_limit
    });
  }

  // Create Stripe checkout session
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  try {
    // Create or get Stripe customer
    let customerId = req.user.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: { user_id: req.user.id }
      });
      customerId = customer.id;
      
      const db = getDb();
      db.prepare('UPDATE users SET stripe_customer_id = ? WHERE id = ?').run(customerId, req.user.id);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `FlowForge ${plan.name}`,
            description: `${plan.exec_limit.toLocaleString()} executions/month`
          },
          unit_amount: plan.price * 100
        },
        quantity: 1
      }],
      mode: 'subscription',
      success_url: `${req.protocol}://${req.get('host')}/dashboard/billing?success=true`,
      cancel_url: `${req.protocol}://${req.get('host')}/dashboard/billing?canceled=true`,
      metadata: {
        user_id: req.user.id,
        plan_tier
      }
    });

    res.json({ checkout_url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Get billing portal
router.get('/portal', async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY || !req.user.stripe_customer_id) {
    return res.status(400).json({ error: 'No billing account configured' });
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: req.user.stripe_customer_id,
      return_url: `${req.protocol}://${req.get('host')}/dashboard/billing`
    });
    
    res.json({ portal_url: session.url });
  } catch (err) {
    console.error('Stripe portal error:', err);
    res.status(500).json({ error: 'Failed to create billing portal session' });
  }
});

// Cancel subscription
router.post('/cancel', async (req, res) => {
  const db = getDb();
  
  if (req.user.stripe_subscription_id && process.env.STRIPE_SECRET_KEY) {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    try {
      await stripe.subscriptions.cancel(req.user.stripe_subscription_id);
    } catch (err) {
      console.error('Cancel error:', err);
    }
  }

  // Downgrade to free
  db.prepare(`
    UPDATE users SET 
      plan_tier = 'free',
      exec_limit = 500,
      stripe_subscription_id = NULL,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(req.user.id);

  res.json({ message: 'Subscription canceled. Reverted to Free plan.' });
});

module.exports = router;
