import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

export default function AdminDashboard({ initialTab = 'overview' }) {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'executions') fetchExecutions();
  }, [activeTab]);

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

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchExecutions = async () => {
    try {
      const res = await fetch('/api/admin/executions?limit=100', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setExecutions(data.executions || []);
      }
    } catch (err) {
      console.error('Failed to fetch executions:', err);
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
            <h3>All Users ({users.length})</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Plan</th>
                    <th>Executions Used</th>
                    <th>Exec Limit</th>
                    <th>Admin</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>{u.name || '-'}</td>
                      <td><span className="badge badge-info">{u.plan_tier}</span></td>
                      <td>{u.executions_used?.toLocaleString()}</td>
                      <td>{u.exec_limit?.toLocaleString()}</td>
                      <td>{u.is_admin ? '✅' : '❌'}</td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'executions' && (
          <div className="executions-section">
            <h3>All Executions ({executions.length})</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Workflow</th>
                    <th>Status</th>
                    <th>Error</th>
                    <th>Time (ms)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {executions.map(e => (
                    <tr key={e.id}>
                      <td>{e.user_email}</td>
                      <td>{e.workflow_name}</td>
                      <td><span className={`badge badge-${e.status === 'success' ? 'success' : 'danger'}`}>{e.status}</span></td>
                      <td>{e.error_message ? e.error_message.substring(0, 50) : '-'}</td>
                      <td>{e.execution_time_ms || '-'}</td>
                      <td>{new Date(e.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
