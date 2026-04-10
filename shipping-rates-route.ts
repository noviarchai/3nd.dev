import { NextResponse } from 'next/server'
import { getSetting } from '@/lib/db'
import { getCanadaPostRates } from '@/lib/canadapost'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { postalCode, weightGrams = 300 } = body

    if (!postalCode) {
      return NextResponse.json({ error: 'Postal code required' }, { status: 400 })
    }

    // Get markup from settings
    const markupStr = await getSetting('shipping_markup_percent')
    const markup = markupStr ? parseFloat(markupStr) : 0

    // weightGrams comes in — canadapost.ts converts to kg internally
    const rates = await getCanadaPostRates(postalCode, weightGrams, markup)

    return NextResponse.json({ rates })
  } catch (error) {
    console.error('Shipping rates error:', error)
    return NextResponse.json({
      rates: [
        { id: 'regular', name: 'Canada Post Regular Parcel', rate: 12.99, deliveryDays: '5-7 business days' },
        { id: 'expedited', name: 'Canada Post Express Parcel', rate: 24.99, deliveryDays: '2-3 business days' },
        { id: 'priority', name: 'Canada Post Priority', rate: 39.99, deliveryDays: '1-2 business days' },
      ]
    })
  }
}
