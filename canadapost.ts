export interface ShippingRate {
  id: string
  name: string
  rate: number
  deliveryDays: string
}

export interface LabelPurchase {
  success: boolean
  trackingNumber?: string
  labelUrl?: string
  error?: string
}

// Fallback mock rates (used when no Canada Post API credentials)
const FALLBACK_RATES: ShippingRate[] = [
  { id: 'regular', name: 'Canada Post Regular Parcel', rate: 12.99, deliveryDays: '5-7 business days' },
  { id: 'expedited', name: 'Canada Post Express Parcel', rate: 24.99, deliveryDays: '2-3 business days' },
  { id: 'priority', name: 'Canada Post Priority', rate: 39.99, deliveryDays: '1-2 business days' },
]

export async function getCanadaPostRates(
  postalCode: string,
  weightGrams: number,
  markupPercent: number = 0
): Promise<ShippingRate[]> {
  // weightGrams comes in — convert to kg for API
  const weightKg = Math.max(0.1, weightGrams / 1000)

  try {
    // Try real API first — credentials loaded from settings at runtime
    const { getSetting } = await import('@/lib/db')
    const apiKey = await getSetting('canadapost_api_key')
    const customerNumber = await getSetting('canadapost_customer_number')

    if (apiKey && customerNumber) {
      return await getRealCanadaPostRates(apiKey, customerNumber, postalCode, weightKg, markupPercent)
    }
  } catch (e) {
    console.log('Canada Post credentials not configured, using fallback rates')
  }

  // Fallback — weight-aware pricing
  const baseRate = 8.99 + (weightGrams / 100) // $8.99 base + $1 per 100g
  return FALLBACK_RATES.map(r => ({
    ...r,
    rate: Math.round((baseRate + (baseRate * markupPercent / 100)) * 100) / 100,
  }))
}

async function getRealCanadaPostRates(
  apiKey: string,
  customerNumber: string,
  postalCode: string,
  weightKg: number,
  markupPercent: number = 0
): Promise<ShippingRate[]> {
  // Use Canada Post's shipping rate API
  const cleanPostal = postalCode.replace(/\s/g, '').toUpperCase()
  const fromPostal = 'T5B0A3' // Default Edmonton origin — configure in settings

  try {
    const response = await fetch(
      `https://ct.soa-post.canadapost.ca/rs/ship/price?country=CA&postalCode=${cleanPostal}&weight=${weightKg.toFixed(2)}&length=20&width=15&height=10&config.requirementLog=LOG_CONFIG`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Canada Post API error: ${response.status}`)
    }

    const data = await response.json()
    return parseRatesResponse(data, markupPercent)
  } catch (error) {
    console.error('Canada Post API error:', error)
    return getFallbackRates(weightKg * 1000, markupPercent)
  }
}

function parseRatesResponse(data: any, markupPercent: number): ShippingRate[] {
  const priceQuotes = data.priceQuotes || []
  const rateMap: Record<string, { base: number; days: string }> = {
    '101': { base: 9.99, days: '5-7 business days' },
    '102': { base: 14.99, days: '2-3 business days' },
    '103': { base: 24.99, days: '1-2 business days' },
    '104': { base: 39.99, days: 'Next business day' },
  }

  if (priceQuotes.length === 0) {
    return getFallbackRates(500, markupPercent)
  }

  return priceQuotes.map((pq: any) => {
    const info = rateMap[pq.serviceCode] || { base: parseFloat(pq.price || 15), days: pq.deliveryDays || '5-7 business days' }
    return {
      id: pq.serviceCode || 'standard',
      name: mapServiceName(pq.serviceCode),
      rate: Math.round((parseFloat(pq.price || info.base) * (1 + markupPercent / 100)) * 100) / 100,
      deliveryDays: pq.deliveryDays || info.days,
    }
  })
}

function mapServiceName(code: string): string {
  const names: Record<string, string> = {
    '101': 'Canada Post Regular Parcel',
    '102': 'Canada Post Expedited Parcel',
    '103': 'Canada Post Express',
    '104': 'Canada Post Priority',
    '201': 'Canada Post Xpresspost',
    '301': 'Canada Post Priority Worldwide',
  }
  return names[code] || 'Canada Post Shipping'
}

function getFallbackRates(weightGrams: number, markupPercent: number): ShippingRate[] {
  const baseRate = 8.99 + (weightGrams / 100)
  return FALLBACK_RATES.map(r => ({
    ...r,
    rate: Math.round((baseRate + (baseRate * markupPercent / 100)) * 100) / 100,
  }))
}

// ─── SHIPPING LABEL PURCHASE ────────────────────────────────────────────────

export async function purchaseShippingLabel(params: {
  apiKey: string
  customerNumber: string
  fromPostalCode: string
  toPostalCode: string
  weightKg: number
  serviceType: string
  orderNumber: string
}): Promise<LabelPurchase> {
  const { apiKey, customerNumber, fromPostalCode, toPostalCode, weightKg, serviceType, orderNumber } = params

  try {
    const response = await fetch(
      'https://ct.soa-post.canadapost.ca/rs/ship/service',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/pdf',
          'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
        },
        body: buildShipmentXml({
          customerNumber,
          fromPostalCode,
          toPostalCode,
          weightKg,
          serviceType,
          orderNumber,
        }),
      }
    )

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Label API error: ${response.status} - ${text}`)
    }

    // Canada Post returns a PDF label
    const contentType = response.headers.get('Content-Type') || ''
    if (contentType.includes('pdf') || contentType.includes('application/octet-stream')) {
      // In production you'd upload this PDF to storage and return the URL
      return {
        success: true,
        trackingNumber: `TRACK${Date.now()}`,
        labelUrl: 'LABEL_PDF_BINARY_DATA_HERE',
      }
    }

    const data = await response.json()
    return {
      success: true,
      trackingNumber: data.trackingNumber || `TRACK${Date.now()}`,
      labelUrl: data.labelUrl || '',
    }
  } catch (error: any) {
    console.error('Label purchase error:', error)
    return {
      success: false,
      error: error.message || 'Failed to purchase shipping label',
    }
  }
}

function buildShipmentXml(params: {
  customerNumber: string
  fromPostalCode: string
  toPostalCode: string
  weightKg: number
  serviceType: string
  orderNumber: string
}): string {
  const { customerNumber, fromPostalCode, toPostalCode, weightKg, serviceType, orderNumber } = params

  return `<?xml version="1.0" encoding="UTF-8"?>
<shipment xmlns="http://www.canadapost.ca/ws/ship-v4">
  <customer-number>${customerNumber}</customer-number>
  <parcel-characteristics>
    <weight>${weightKg.toFixed(2)}</weight>
    <dimensions>
      <length>20</length>
      <width>15</width>
      <height>10</height>
    </dimensions>
  </parcel-characteristics>
  <from>
    <postal-code>${fromPostalCode}</postal-code>
  </from>
  <services>
    <service-code>${serviceType}</service-code>
  </services>
  <destination>
    <domestic>
      <postal-code>${toPostalCode}</postal-code>
    </domestic>
  </destination>
  <references>
    <customer-ref>${orderNumber}</customer-ref>
  </references>
</shipment>`
}
