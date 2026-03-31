import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <div>
          <h1>Admin Panel</h1>
          <p className="text-secondary">Monitor and manage FlowForge</p>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.stats?.total_users || 0}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.stats?.total_workflows || 0}</span>
            <span className="stat-label">Workflows</span>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.stats?.total_executions || 0}</span>
            <span className="stat-label">Executions</span>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.stats?.active_workflows || 0}</span>
            <span className="stat-label">Active Workflows</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`tab ${activeTab === 'executions' ? 'active' : ''}`}
          onClick={() => setActiveTab('executions')}
        >
          Executions
        </button>
        <button 
          className={`tab ${activeTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          Integrations
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content card">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h3>Plan Distribution</h3>
            <div className="plan-distribution">
              {stats?.stats?.plan_distribution?.map(p => (
                <div key={p.plan_tier} className="plan-item">
                  <span className="plan-name">{p.plan_tier}</span>
                  <span className="plan-count">{p.count} users</span>
                </div>
              ))}
            </div>

            <h3 className="mt-3">Recent Executions</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Workflow</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recent_executions?.slice(0, 10).map(exec => (
                    <tr key={exec.id}>
                      <td>{exec.user_email}</td>
                      <td>{exec.workflow_name}</td>
                      <td>
                        <span className={`badge badge-${exec.status === 'success' ? 'success' : 'danger'}`}>
                          {exec.status}
                        </span>
                      </td>
                      <td>{new Date(exec.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <p className="text-muted">User management coming soon. View all users via API.</p>
          </div>
        )}

        {activeTab === 'executions' && (
          <div className="executions-section">
            <p className="text-muted">Execution monitoring coming soon.</p>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="integrations-section">
            <h3>Integration Usage</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Integration</th>
                    <th>Connections</th>
                    <th>Healthy</th>
                    <th>Workflows</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.stats?.workflows_by_trigger?.map(w => (
                    <tr key={w.trigger_app}>
                      <td>{w.trigger_app}</td>
                      <td>-</td>
                      <td>-</td>
                      <td>{w.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
