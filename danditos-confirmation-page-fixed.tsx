'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Order {
  id: number
  order_number: string
  total: number
  status: string
  created_at: string
}

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (orderNumber) {
      fetch('/api/orders?orderNumber=' + orderNumber)
        .then(res => res.json())
        .then(data => {
          if (data && data.order_number) {
            setOrder(data)
          }
        })
        .catch(console.error)
    }
  }, [orderNumber])

  return (
    <section className="confirmation-page">
      <div className="container">
        <div className="confirmation-icon">&#10003;</div>
        <h1>Order Confirmed!</h1>
        {orderNumber && <p className="order-number">Order #{orderNumber}</p>}
        <p>Thank you for your order. We have received your payment and will start preparing your sauces right away.</p>
        <p style={{ marginTop: '16px' }}>A confirmation email has been sent to your email address.</p>
        
        <div style={{ marginTop: '48px' }}>
          <a href="/account" className="btn btn-secondary" style={{ marginRight: '16px' }}>
            View Order
          </a>
          <a href="/shop" className="btn btn-primary">
            Continue Shopping
          </a>
        </div>
      </div>
    </section>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
