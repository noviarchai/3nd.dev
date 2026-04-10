INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price) VALUES (1, 1, 'Mild Garlic Inferno', 1, 12.99, 12.99);
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price) VALUES (1, 2, 'Calgary Heat', 1, 14.99, 14.99);
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price) VALUES (1, 3, 'Extreme Edition', 1, 18.99, 18.99);

INSERT INTO orders (order_number, customer_email, customer_name, shipping_address, subtotal, shipping_cost, total, stripe_payment_id, shipping_method, status, created_at)
VALUES (
  'DAND-2026-002',
  'sarah.k@example.com',
  'Sarah K.',
  '{"name": "Sarah K.", "address": "888 Heritage Dr SE", "city": "Calgary", "province": "AB", "postal": "T2H 1A4", "country": "Canada"}',
  14.99,
  11.50,
  26.49,
  'pi_test_9x2k3j4h5g6f',
  'Canada Post Express',
  'pending',
  NOW() - INTERVAL '30 minutes'
);

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 2, id, name, 1, price, price FROM products WHERE slug = 'calgary-heat';
