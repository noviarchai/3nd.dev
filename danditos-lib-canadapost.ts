interface ShippingRate {
  name: string
  rate: number
  deliveryDays: string
}

export async function getCanadaPostRates(
  postalCode: string,
  weight: number,
  markupPercent: number = 0
): Promise<ShippingRate[]> {
  // Canada Post API credentials would go here
  // For demo purposes, return mock rates that can be configured
  
  const baseRates = [
    { name: 'Canada Post Regular Parcel', baseRate: 12.99, deliveryDays: '5-7 business days' },
    { name: 'Canada Post Express Parcel', baseRate: 24.99, deliveryDays: '2-3 business days' },
    { name: 'Canada Post Priority', baseRate: 39.99, deliveryDays: '1-2 business days' },
  ]

  return baseRates.map(option => ({
    name: option.name,
    rate: Math.round((option.baseRate + (option.baseRate * markupPercent / 100)) * 100) / 100,
    deliveryDays: option.deliveryDays,
  }))
}

export async function getRealCanadaPostRates(
  apiKey: string,
  customerNumber: string,
  postalCode: string,
  weight: number,
  markupPercent: number = 0
): Promise<ShippingRate[]> {
  try {
    // Canada Post Rating API endpoint
    const response = await fetch('https://ct.soa-post.canadapost.ca/rs/ship/service', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'Accept': 'application/json',
      },
      body: buildRateRequestXml(apiKey, customerNumber, postalCode, weight)
    })

    if (!response.ok) {
      throw new Error('Canada Post API error')
    }

    const data = await response.json()
    return parseRatesResponse(data, markupPercent)
  } catch (error) {
    console.error('Canada Post API error:', error)
    // Return fallback rates
    return getCanadaPostRates(postalCode, weight, markupPercent)
  }
}

function buildRateRequestXml(apiKey: string, customerNumber: string, postalCode: string, weight: number): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <mailing-rate-request xmlns="http://www.canadapost.ca/ws/ship/rate-v4">
      <customer-number>${customerNumber}</customer-number>
      <quote-type>commercial</quote-type>
      <expected-delivery-date></expected-delivery-date>
      <from-postal-code>T5B0A3</from-postal-code>
      <postal-code>${postalCode}</postal-code>
      <weight>${weight}</weight>
      <length>20</length>
      <width>15</width>
      <height>10</height>
      <destination>domestic</destination>
    </mailing-rate-request>`
}

function parseRatesResponse(data: any, markupPercent: number): ShippingRate[] {
  // Parse the actual Canada Post response format
  // This is simplified - actual implementation would need proper XML/JSON parsing
  const rates = data.pricequotes || []
  return rates.map((rate: any) => ({
    name: rate.servicename || 'Standard Shipping',
    rate: Math.round((parseFloat(rate.price || 15) * (1 + markupPercent / 100)) * 100) / 100,
    deliveryDays: rate.deliverydays || '5-7 business days',
  }))
}
