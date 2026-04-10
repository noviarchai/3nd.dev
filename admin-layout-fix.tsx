'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    // Skip auth check on the login page itself
    if (pathname === '/admin/login') {
      setVerified(true)
      return
    }
    
    const adminKey = localStorage.getItem('adminKey')
    if (adminKey !== 'dandito-admin-2024') {
      router.push('/admin/login')
    } else {
      setVerified(true)
    }
  }, [pathname, router])

  if (!verified) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--charcoal)'
      }}>
        <p style={{ color: '#888' }}>Verifying...</p>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <a href="/admin" className={'admin-nav-item' + (pathname === '/admin' ? ' active' : '')}>Dashboard</a>
        <a href="/admin/orders" className={'admin-nav-item' + (pathname === '/admin/orders' ? ' active' : '')}>Orders</a>
        <a href="/admin/products" className={'admin-nav-item' + (pathname === '/admin/products' ? ' active' : '')}>Products</a>
        <a href="/admin/settings" className={'admin-nav-item' + (pathname === '/admin/settings' ? ' active' : '')}>Settings</a>
        <a href="/" className="admin-nav-item" style={{ marginTop: '40px' }}>← Back to Store</a>
        <button
          onClick={() => {
            localStorage.removeItem('adminKey')
            router.push('/admin/login')
          }}
          className="admin-nav-item"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', textAlign: 'left' }}
        >
          Logout
        </button>
      </aside>
      <main className="admin-content">
        {children}
      </main>
    </div>
  )
}
