'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Product {
  id: number
  name: string
  slug: string
  price: number
  heat_level: string
  image_url: string
  description: string
}

function ShopContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const heatFilter = searchParams.get('heat')

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        let filtered = data
        if (heatFilter) {
          filtered = data.filter((p: Product) => p.heat_level === heatFilter)
        }
        setProducts(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [heatFilter])

  const getFilterClass = (filter: string | null) => {
    if (!heatFilter && filter === null) return 'btn-primary'
    if (heatFilter === filter) return 'btn-primary'
    return 'btn-secondary'
  }

  return (
    <>
      <div className="shop-header">
        <div className="container">
          <h1>The Sauce Shop</h1>
          <p>Small batch. Bold flavor. Made in Calgary.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', justifyContent: 'center' }}>
            <a href="/shop" className={`btn ${getFilterClass(null)}`}>All</a>
            <a href="/shop?heat=mild" className={`btn ${getFilterClass('mild')}`}>Mild</a>
            <a href="/shop?heat=medium" className={`btn ${getFilterClass('medium')}`}>Medium</a>
            <a href="/shop?heat=hot" className={`btn ${getFilterClass('hot')}`}>Hot</a>
            <a href="/shop?heat=extreme" className={`btn ${getFilterClass('extreme')}`}>Extreme</a>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
          ) : products.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888' }}>No sauces found with this heat level.</p>
          ) : (
            <div className="editorial-grid">
              {products.map((product, index) => {
                const cardClass = index === 0 ? '1' : index === 1 ? '2' : index === 2 ? '3' : '4'
                return (
                  <a 
                    href={'/product/' + product.slug}
                    key={product.id} 
                    className={`editorial-card editorial-${cardClass}`}
                  >
                    <img src={product.image_url} alt={product.name} />
                    <div className="editorial-overlay">
                      <span className={`heat-badge heat-${product.heat_level}`}>{product.heat_level}</span>
                      <h3>{product.name}</h3>
                      <p className="price">${product.price.toFixed(2)}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>}>
      <ShopContent />
    </Suspense>
  )
}
