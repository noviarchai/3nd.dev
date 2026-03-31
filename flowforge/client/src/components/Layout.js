import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout({ children, admin = false }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userNav = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/workflows/new', label: 'New Workflow', icon: '⚡' },
    { path: '/dashboard/apps', label: 'Connected Apps', icon: '🔗' },
    { path: '/dashboard/history', label: 'History', icon: '📜' },
    { path: '/dashboard/billing', label: 'Billing', icon: '💳' },
  ];

  const adminNav = [
    { path: '/admin', label: 'Overview', icon: '📈' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/workflows', label: 'Workflows', icon: '🔄' },
    { path: '/admin/integrations', label: 'Integrations', icon: '🔌' },
  ];

  const nav = admin ? adminNav : userNav;

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">FlowForge</span>
          </Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {nav.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {admin && (
            <Link to="/dashboard" className="nav-item">
              <span className="nav-icon">👤</span>
              <span>User Mode</span>
            </Link>
          )}
          <button className="nav-item logout" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <div className="topbar-user">
            <span className="user-name">{user?.name || user?.email}</span>
            <span className="badge badge-info">{user?.plan_tier}</span>
          </div>
        </header>

        <div className="content-area">
          {children}
        </div>
      </main>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
