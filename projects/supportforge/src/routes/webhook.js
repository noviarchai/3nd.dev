const express = require('express');
const { handleWebhook } = require('../services/stripe');

const router = express.Router();

// Stripe webhook
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = await handleWebhook(req.body, sig);
    res.json({ received: true, type: event.type });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
