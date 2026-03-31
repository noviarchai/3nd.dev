const Stripe = require('stripe');
const db = require('../models/db');
const dotenv = require('dotenv');

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_placeholder';

async function createCheckoutSession(workspaceId, userId, workspaceName) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${process.env.APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL}/billing/cancel`,
    metadata: {
      workspaceId,
      userId,
    },
    subscription_data: {
      metadata: {
        workspaceId,
      },
    },
  });

  return session;
}

async function createBillingPortalSession(customerId, returnUrl) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl || `${process.env.APP_URL}/dashboard`,
  });

  return session;
}

async function handleWebhook(payload, sig) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const workspaceId = session.metadata.workspaceId;
      
      if (workspaceId) {
        db.prepare(`
          UPDATE workspaces 
          SET stripe_customer_id = ?, 
              stripe_subscription_id = ?, 
              stripe_price_id = ?,
              plan = 'paid',
              subscription_status = 'active',
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(session.customer, session.subscription, PRICE_ID, workspaceId);
        
        console.log(`✅ Subscription activated for workspace ${workspaceId}`);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const workspaceId = subscription.metadata?.workspaceId;
      
      if (workspaceId) {
        const status = subscription.status === 'active' ? 'active' : subscription.status;
        db.prepare(`
          UPDATE workspaces 
          SET subscription_status = ?, updated_at = CURRENT_TIMESTAMP
          WHERE stripe_subscription_id = ?
        `).run(status, subscription.id);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      
      db.prepare(`
        UPDATE workspaces 
        SET plan = 'canceled', 
            subscription_status = 'canceled',
            updated_at = CURRENT_TIMESTAMP
        WHERE stripe_subscription_id = ?
      `).run(subscription.id);
      
      console.log(`❌ Subscription canceled for subscription ${subscription.id}`);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      
      db.prepare(`
        UPDATE workspaces 
        SET subscription_status = 'past_due', updated_at = CURRENT_TIMESTAMP
        WHERE stripe_customer_id = ?
      `).run(invoice.customer);
      
      console.log(`⚠️ Payment failed for customer ${invoice.customer}`);
      break;
    }
  }

  return event;
}

async function getSubscription(subscriptionId) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

async function getInvoices(customerId) {
  const invoices = await stripe.invoices.list({ customer: customerId, limit: 10 });
  return invoices.data;
}

module.exports = {
  createCheckoutSession,
  createBillingPortalSession,
  handleWebhook,
  getSubscription,
  getInvoices,
  stripe
};
