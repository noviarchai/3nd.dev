const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

// Stripe webhook handler
router.post('/webhook', async (req, res) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Stripe webhook not configured' });
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const db = getDb();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { user_id, plan_tier } = session.metadata || {};
        
        if (user_id && plan_tier) {
          const limits = { free: 500, starter: 5000, pro: 25000, business: 100000 };
          const exec_limit = limits[plan_tier] || 500;
          
          db.prepare(`
            UPDATE users SET 
              plan_tier = ?,
              exec_limit = ?,
              stripe_subscription_id = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(plan_tier, exec_limit, session.subscription, user_id);
          
          console.log(`User ${user_id} subscribed to ${plan_tier}`);
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        const userId = customer.metadata?.user_id;
        
        if (userId) {
          db.prepare('UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(userId);
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        const userId = customer.metadata?.user_id;
        
        if (userId) {
          db.prepare(`
            UPDATE users SET 
              plan_tier = 'free',
              exec_limit = 500,
              stripe_subscription_id = NULL,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(userId);
          
          console.log(`User ${userId} subscription canceled`);
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log(`Payment failed for invoice ${invoice.id}`);
        break;
      }
    }
  } catch (err) {
    console.error('Stripe webhook processing error:', err);
  }

  res.json({ received: true });
});

module.exports = router;
