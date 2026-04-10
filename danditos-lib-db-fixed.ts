import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  database: 'danditos',
  user: 'danditos',
  password: 'danditos_pass_2024',
  port: 5432,
})

export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const res = await client.query(text, params)
    return res
  } finally {
    client.release()
  }
}

export async function getProducts() {
  const result = await query('SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC')
  return result.rows
}

export async function getProductBySlug(slug: string) {
  const result = await query('SELECT * FROM products WHERE slug = $1 AND is_active = true', [slug])
  return result.rows[0]
}

export async function getProductById(id: number) {
  const result = await query('SELECT * FROM products WHERE id = $1', [id])
  return result.rows[0]
}

export async function createOrder(orderData: any) {
  const result = await query(
    'INSERT INTO orders (order_number, customer_email, customer_name, shipping_address, subtotal, shipping_cost, total, stripe_payment_id, shipping_method, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
    [orderData.order_number, orderData.customer_email, orderData.customer_name, JSON.stringify(orderData.shipping_address), orderData.subtotal, orderData.shipping_cost, orderData.total, orderData.stripe_payment_id, orderData.shipping_method, orderData.status || 'pending']
  )
  return result.rows[0]
}

export async function createOrderItem(itemData: any) {
  const result = await query(
    'INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [itemData.order_id, itemData.product_id, itemData.product_name, itemData.quantity, itemData.unit_price, itemData.total_price]
  )
  return result.rows[0]
}

export async function getOrders(email?: string) {
  if (email) {
    const result = await query('SELECT * FROM orders WHERE customer_email = $1 ORDER BY created_at DESC', [email])
    return result.rows
  }
  const result = await query('SELECT * FROM orders ORDER BY created_at DESC')
  return result.rows
}

export async function getOrderById(id: number) {
  const result = await query('SELECT * FROM orders WHERE id = $1', [id])
  return result.rows[0]
}

export async function getOrderByNumber(orderNumber: string) {
  const result = await query('SELECT * FROM orders WHERE order_number = $1', [orderNumber])
  return result.rows[0]
}

export async function getOrderItems(orderId: number) {
  const result = await query('SELECT * FROM order_items WHERE order_id = $1', [orderId])
  return result.rows
}

export async function updateOrderStatus(id: number, status: string) {
  const result = await query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, id])
  return result.rows[0]
}

export async function updateOrderStripeId(id: number, stripePaymentId: string) {
  const result = await query('UPDATE orders SET stripe_payment_id = $1 WHERE id = $2 RETURNING *', [stripePaymentId, id])
  return result.rows[0]
}

export async function getSetting(key: string) {
  const result = await query('SELECT value FROM settings WHERE key = $1', [key])
  return result.rows[0]?.value
}

export async function setSetting(key: string, value: string) {
  const result = await query(
    'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
    [key, value]
  )
  return result
}

export async function getSettings() {
  const result = await query('SELECT * FROM settings')
  const settings: Record<string, string> = {}
  result.rows.forEach((row: any) => { settings[row.key] = row.value })
  return settings
}

export async function updateProduct(id: number, data: any) {
  const result = await query(
    'UPDATE products SET name=$1, slug=$2, description=$3, heat_level=$4, price=$5, stock=$6, image_url=$7, is_active=$8 WHERE id=$9 RETURNING *',
    [data.name, data.slug, data.description, data.heat_level, data.price, data.stock, data.image_url, data.is_active, id]
  )
  return result.rows[0]
}

export async function createProduct(data: any) {
  const result = await query(
    'INSERT INTO products (name, slug, description, heat_level, price, stock, image_url, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [data.name, data.slug, data.description, data.heat_level, data.price, data.stock, data.image_url, data.is_active || true]
  )
  return result.rows[0]
}

export async function getAdminStats() {
  const ordersResult = await query(`
    SELECT 
      COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today_orders,
      COALESCE(SUM(total) FILTER (WHERE DATE(created_at) = CURRENT_DATE), 0) as today_revenue,
      COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
      COUNT(*) as total_orders
    FROM orders
  `)
  return ordersResult.rows[0]
}
