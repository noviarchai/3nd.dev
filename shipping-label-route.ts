import { NextResponse } from 'next/server'
import { getSetting } from '@/lib/db'
import { purchaseShippingLabel } from '@/lib/canadapost'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, serviceType = '101' } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    // Load credentials from settings
    const apiKey = await getSetting('canadapost_api_key')
    const customerNumber = await getSetting('canadapost_customer_number')
    const fromPostal = await getSetting('shipping_origin_postal') || 'T5B0A3'

    if (!apiKey || !customerNumber) {
      return NextResponse.json({
        success: false,
        error: 'Canada Post API not configured. Add your API key and customer number in Settings.'
      }, { status: 400 })
    }

    // Get order details
    const { getOrderById, getOrderItems, getProductById } = await import('@/lib/db')
    const order = await getOrderById(parseInt(orderId))
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const items = await getOrderItems(parseInt(orderId))

    // Calculate total weight from all items
    let totalWeightGrams = 0
    for (const item of items) {
      const product = await getProductById(item.product_id)
      const weight = product?.weight_grams || 300
      totalWeightGrams += weight * item.quantity
    }

    const toAddress = typeof order.shipping_address === 'string'
      ? JSON.parse(order.shipping_address)
      : order.shipping_address

    const toPostal = (toAddress.postal || '').replace(/\s/g, '').toUpperCase()

    const result = await purchaseShippingLabel({
      apiKey,
      customerNumber,
      fromPostalCode: fromPostal,
      toPostalCode: toPostal,
      weightKg: totalWeightGrams / 1000,
      serviceType,
      orderNumber: order.order_number,
    })

    if (result.success) {
      // Update order with tracking number
      const { updateOrderStatus } = await import('@/lib/db')
      await updateOrderStatus(parseInt(orderId), 'shipped', result.trackingNumber)
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error: any) {
    console.error('Label purchase error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to purchase shipping label'
    }, { status: 500 })
  }
}
