'use client'
import { useEffect, useState } from 'react'

interface OrderItem {
  id: number
  order_id: number
  product_id: number
  product_name: string
  quantity: number
  unit_price: string
  total_price: string
}

interface Order {
  id: number
  order_number: string
  customer_email: string
  customer_name: string
  total: string
  subtotal: string
  shipping_cost: string
  status: string
  shipping_method: string
  tracking_number?: string
  created_at: string
  shipping_address: any
  items?: OrderItem[]
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [orderLoading, setOrderLoading] = useState(false)
  const [labelLoading, setLabelLoading] = useState(false)
  const [labelMessage, setLabelMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const viewOrder = async (order: Order) => {
    setOrderLoading(true)
    setLabelMessage(null)
    try {
      const res = await fetch(`/api/orders?id=${order.id}`)
      const fullOrder = await res.json()
      setSelectedOrder(fullOrder)
    } catch (err) {
      console.error('Failed to load order:', err)
    }
    setOrderLoading(false)
  }

  const updateStatus = async (orderId: number, status: string) => {
    await fetch(`/api/orders?id=${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status })
    }
  }

  const buyShippingLabel = async () => {
    if (!selectedOrder) return
    if (!confirm('Buy and print a shipping label for this order? This will mark the order as shipped.')) return

    setLabelLoading(true)
    setLabelMessage(null)

    try {
      // Get the service type from the shipping method
      const serviceTypeMap: Record<string, string> = {
        'regular': '101',
        'expedited': '102',
        'express': '103',
        'priority': '104',
      }
      const serviceType = serviceTypeMap[selectedOrder.shipping_method?.toLowerCase().split(' ')[0]] || '102'

      const res = await fetch('/api/shipping-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          serviceType
        })
      })

      const data = await res.json()

      if (data.success) {
        setLabelMessage({ type: 'success', text: `Label purchased! Tracking: ${data.trackingNumber || 'N/A'}` })
        // Refresh the order to get updated tracking number
        const orderRes = await fetch(`/api/orders?id=${selectedOrder.id}`)
        const fullOrder = await orderRes.json()
        setSelectedOrder(fullOrder)
        setOrders(orders.map(o => o.id === selectedOrder.id ? fullOrder : o))
      } else {
        setLabelMessage({ type: 'error', text: data.error || 'Failed to purchase label' })
      }
    } catch (err) {
      setLabelMessage({ type: 'error', text: 'Network error — check Settings for Canada Post API keys' })
    }

    setLabelLoading(false)
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1>Orders</h1>

      {selectedOrder ? (
        <div>
          <button 
            onClick={() => { setSelectedOrder(null); setLabelMessage(null); }}
            className="btn btn-secondary"
            style={{ marginBottom: '24px' }}
          >
            ← Back to Orders
          </button>

          {labelMessage && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              background: labelMessage.type === 'success' ? '#1a3a1a' : '#3a1a1a',
              color: labelMessage.type === 'success' ? '#4ade80' : '#f87171',
              border: `1px solid ${labelMessage.type === 'success' ? '#4ade80' : '#f87171'}30`
            }}>
              {labelMessage.text}
            </div>
          )}

          <div className="checkout-form">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3>Order #{selectedOrder.order_number}</h3>
              <select 
                value={selectedOrder.status}
                onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                style={{ 
                  padding: '8px 16px', 
                  background: 'var(--charcoal)', 
                  border: '1px solid #444', 
                  color: 'var(--cream)',
                  borderRadius: '4px'
                }}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <p style={{ color: '#888', marginBottom: '8px' }}>Customer</p>
                <p>{selectedOrder.customer_name}</p>
                <p style={{ color: '#888' }}>{selectedOrder.customer_email}</p>
              </div>
              <div>
                <p style={{ color: '#888', marginBottom: '8px' }}>Date</p>
                <p>{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p style={{ color: '#888', marginBottom: '8px' }}>Shipping Address</p>
                <p>{selectedOrder.shipping_address?.name}</p>
                <p style={{ color: '#888' }}>{selectedOrder.shipping_address?.address}</p>
                <p style={{ color: '#888' }}>{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.province} {selectedOrder.shipping_address?.postal}</p>
              </div>
              <div>
                <p style={{ color: '#888', marginBottom: '8px' }}>Shipping Method</p>
                <p>{selectedOrder.shipping_method}</p>
                {selectedOrder.tracking_number && (
                  <p style={{ color: '#4ade80', marginTop: '8px' }}>
                    Tracking: <strong>{selectedOrder.tracking_number}</strong>
                  </p>
                )}
              </div>
            </div>

            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #444' }}>
                <h4 style={{ marginBottom: '16px' }}>Items Ordered</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #444', textAlign: 'left' }}>
                      <th style={{ padding: '8px 0' }}>Product</th>
                      <th style={{ padding: '8px 0' }}>Qty</th>
                      <th style={{ padding: '8px 0', textAlign: 'right' }}>Unit Price</th>
                      <th style={{ padding: '8px 0', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #333' }}>
                        <td style={{ padding: '12px 0' }}>{item.product_name}</td>
                        <td style={{ padding: '12px 0' }}>{item.quantity}</td>
                        <td style={{ padding: '12px 0', textAlign: 'right' }}>${parseFloat(item.unit_price).toFixed(2)}</td>
                        <td style={{ padding: '12px 0', textAlign: 'right' }}>${parseFloat(item.total_price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', marginLeft: 'auto', color: '#888' }}>
                    <span>Subtotal:</span>
                    <span>${parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', marginLeft: 'auto', color: '#888' }}>
                    <span>Shipping:</span>
                    <span>${parseFloat(selectedOrder.shipping_cost).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', marginLeft: 'auto', fontWeight: '700', color: 'var(--ember-orange)', fontSize: '1.2rem', marginTop: '8px' }}>
                    <span>Total:</span>
                    <span>${parseFloat(selectedOrder.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Label Section */}
            {(selectedOrder.status === 'paid' || selectedOrder.status === 'shipped') && (
              <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #444' }}>
                <h4 style={{ marginBottom: '16px' }}>Shipping Label</h4>
                {selectedOrder.tracking_number ? (
                  <div>
                    <p style={{ color: '#4ade80', marginBottom: '12px' }}>
                      ✅ Label purchased — Tracking: <strong>{selectedOrder.tracking_number}</strong>
                    </p>
                    <button
                      onClick={() => window.alert('Label PDF would open here — connect to your label printer or PDF viewer')}
                      className="btn btn-primary"
                      style={{ marginRight: '12px' }}
                    >
                      🖨️ Print Label
                    </button>
                  </div>
                ) : (
                  <div>
                    <p style={{ color: '#888', marginBottom: '12px' }}>
                      No label purchased yet. Add Canada Post API credentials in Settings to enable label purchase.
                    </p>
                    <button
                      onClick={buyShippingLabel}
                      disabled={labelLoading}
                      className="btn btn-primary"
                    >
                      {labelLoading ? 'Purchasing Label...' : '🛒 Buy & Print Shipping Label'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #444' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--ember-orange)' }}>
                Total: ${parseFloat(selectedOrder.total).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr 
                key={order.id} 
                onClick={() => viewOrder(order)}
                style={{ cursor: 'pointer' }}
              >
                <td>#{order.order_number}</td>
                <td>{order.customer_name}</td>
                <td>${parseFloat(order.total).toFixed(2)}</td>
                <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
