INSERT INTO orders (order_number, customer_email, customer_name, shipping_address, subtotal, shipping_cost, total, stripe_payment_id, shipping_method, status, created_at)
VALUES (
  'DAND-2026-001',
  'mike.calgary@example.com',
  'Mike Reynolds',
  '{"name": "Mike Reynolds", "address": "1420 9A St NW", "city": "Calgary", "province": "AB", "postal": "T2M 0L8", "country": "Canada"}',
  32.97,
  12.50,
  45.47,
  'pi_test_3x7f8d9e2c1b0a',
  'Canada Post Expedited',
  'paid',
  NOW() - INTERVAL '2 hours'
) RETURNING id;
