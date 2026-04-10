const express = require('express');
const crypto = require('crypto');

const app = express();

// SaaS backend URLs
const SaaS_URLS = {
  flowbridge: 'http://127.0.0.1:3847',
  supportforge: 'http://127.0.0.1:3848',
  metricpulse: 'http://127.0.0.1:3849'
};

// Stripe price IDs → SaaS mapping
const PRICE_TO_SAAS = {
  // FlowBridge
  'price_1TILOkRo9FTS8oe7nhESZ4nv': 'flowbridge', // Starter
  'price_1TILOkRo9FTS8oe7JWsL7QKH': 'flowbridge', // Pro
  'price_1TILOlRo9FTS8oe7Qo0NfHyC': 'flowbridge', // Business
  
  // SupportForge
  'price_1TILOkRo9FTS8oe7QCYratji': 'supportforge', // $49/mo
  'price_1TILN22Mtt33YPo1ULcA0Etd': 'supportforge', // $49/mo (test)
  
  // MetricPulse
  'price_1TILOkRo9FTS8oe7K2M6Pl9x': 'metricpulse', // Starter
  'price_1TILOkRo9FTS8oe7xqEx1SZX': 'metricpulse', // Pro
  'price_1TILOlRo9FTS8oe7ijD3yUvJ': 'metricpulse', // Enterprise
  'price_1TILN32Mtt33YPo10UYyPr50': 'metricpulse', // Starter (test)
  'price_1TILN92Mtt33YPo1yNcv9mjI': 'metricpulse', // Pro (test)
  'price_1TILNF2Mtt33YPo1gwP1NW8n': 'metricpulse', // Enterprise (test)
};

function getSaasFromEvent(event) {
  // Try to find the price ID from various event structures
  const obj = event.data.object;
  
  // For checkout.session events
  if (obj.object === 'checkout.session') {
    const lineItems = obj.line_items;
    if (lineItems && lineItems.data && lineItems.data[0]) {
      const priceId = lineItems.data[0].price.id;
      if (priceId && PRICE_TO_SAAS[priceId]) {
        return PRICE_TO_SAAS[priceId];
      }
    }
    // Try subscription
    if (obj.subscription && typeof obj.subscription === 'object') {
      const sub = obj.subscription;
      if (sub.items && sub.items.data[0]) {
        const priceId = sub.items.data[0].price.id;
        if (priceId && PRICE_TO_SAAS[priceId]) {
          return PRICE_TO_SAAS[priceId];
        }
      }
    }
  }
  
  // For subscription events
  if (obj.object === 'subscription') {
    if (obj.items && obj.items.data[0]) {
      const priceId = obj.items.data[0].price.id;
      if (priceId && PRICE_TO_SAAS[priceId]) {
        return PRICE_TO_SAAS[priceId];
      }
    }
  }
  
  // For invoice events
  if (obj.object === 'invoice') {
    if (obj.lines && obj.lines.data[0]) {
      const priceId = obj.lines.data[0].price.id;
      if (priceId && PRICE_TO_SAAS[priceId]) {
        return PRICE_TO_SAAS[priceId];
      }
    }
  }
  
  // For customer.subscription events with plan
  if (obj.plan && obj.plan.id) {
    // Try to find a match by plan ID pattern
    for (const [priceId, saas] of Object.entries(PRICE_TO_SAAS)) {
      if (priceId.includes(obj.plan.id) || obj.plan.id.includes(priceId.split('_').pop())) {
        return saas;
      }
    }
  }
  
  // Fallback: try to infer from event type
  if (event.type.startsWith('customer_subscription')) return 'supportforge';
  if (event.type.startsWith('checkout')) return 'supportforge';
  if (event.type.startsWith('flowbridge')) return 'flowbridge';
  
  return null;
}

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  // For now, just forward to all SaaS or use the first matching one
  // In production, you'd verify the webhook signature for each SaaS
  let event;
  try {
    event = JSON.parse(req.body.toString());
  } catch (err) {
    console.error('Invalid JSON:', err.message);
    return res.status(400).send('Invalid JSON');
  }
  
  console.log(`Received Stripe event: ${event.type} (${event.id})`);
  
  const targetSaas = getSaasFromEvent(event);
  
  if (targetSaas && SaaS_URLS[targetSaas]) {
    console.log(`Routing to ${targetSaas} (${SaaS_URLS[targetSaas]})`);
    
    try {
      const response = await fetch(`${SaaS_URLS[targetSaas]}/api/stripe/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Stripe-Signature': sig
        },
        body: req.body
      });
      
      const text = await response.text();
      console.log(`${targetSaas} response: ${response.status} - ${text.substring(0, 100)}`);
      return res.status(response.status).send(text);
    } catch (err) {
      console.error(`Error forwarding to ${targetSaas}:`, err.message);
      return res.status(500).send('Error forwarding webhook');
    }
  }
  
  // If we can't determine the target, log and respond OK to avoid Stripe retries
  console.log(`Could not determine target SaaS for event ${event.type}. Forwarding to all.`);
  
  // Broadcast to all SaaS (for events we can't route)
  const results = await Promise.allSettled(
    Object.entries(SaaS_URLS).map(async ([name, url]) => {
      try {
        const response = await fetch(`${url}/api/stripe/webhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Stripe-Signature': sig
          },
          body: req.body
        });
        return { name, status: response.status, ok: true };
      } catch (err) {
        return { name, error: err.message, ok: false };
      }
    })
  );
  
  console.log('Broadcast results:', results.map(r => r.status === 'fulfilled' ? `${r.value.name}:${r.value.status}` : `${r.reason}`).join(', '));
  res.json({ received: true, broadcast: true });
});

app.get('/api/stripe/webhook', (req, res) => {
  res.json({ status: 'ok', message: 'Stripe webhook endpoint. POST only.' });
});

const PORT = process.env.PORT || 3099;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Stripe webhook router running on port ${PORT}`);
});
