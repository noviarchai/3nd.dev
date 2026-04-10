import { NextResponse } from 'next/server'
import { getOrders, getOrderById, getOrderByNumber, updateOrderStatus, getOrderItems } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const id = searchParams.get('id')
    const orderNumber = searchParams.get('orderNumber')

    if (orderNumber) {
      const order = await getOrderByNumber(orderNumber)
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
      const items = await getOrderItems(order.id)
      return NextResponse.json({ ...order, items })
    }

    if (id) {
      const order = await getOrderById(parseInt(id))
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
      const items = await getOrderItems(order.id)
      return NextResponse.json({ ...order, items })
    }

    const orders = await getOrders(email || undefined)
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    const order = await updateOrderStatus(parseInt(id), body.status)
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
