import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [workflows, setWorkflows] = useState([]);
  const [recentExecutions, setRecentExecutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [wfRes, execRes] = await Promise.all([
        fetch('/api/workflows', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/executions?limit=5', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (wfRes.ok) {
        const wfData = await wfRes.json();
        setWorkflows(wfData.workflows || []);
      }

      if (execRes.ok) {
        const execData = await execRes.json();
        setRecentExecutions(execData.executions || []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const usagePercent = user?.exec_limit ? Math.round((user.executions_used / user.exec_limit) * 100) : 0;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.name || 'there'} 👋</h1>
          <p className="text-secondary">Here's what's happening with your workflows</p>
        </div>
        <Link to="/workflows/new" className="btn btn-primary">
          ⚡ New Workflow
        </Link>
      </div>

      {/* Usage Card */}
      <div className="usage-card card">
        <div className="usage-header">
          <div>
            <h3>Usage This Month</h3>
            <p className="text-muted">
              {user?.executions_used?.toLocaleString() || 0} of {user?.exec_limit?.toLocaleString() || 0} executions
            </p>
          </div>
          <span className="badge badge-info">{user?.plan_tier}</span>
        </div>
        <div className="usage-bar">
          <div 
            className="usage-fill" 
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
        {usagePercent > 80 && (
          <p className="usage-warning">
            ⚠️ You've used {usagePercent}% of your monthly executions
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <span className="stat-value">{workflows.length}</span>
            <span className="stat-label">Active Workflows</span>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <span className="stat-value">{workflows.filter(w => w.is_active).length}</span>
            <span className="stat-label">Running</span>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-value">{workflows.reduce((sum, w) => sum + (w.total_runs || 0), 0)}</span>
            <span className="stat-label">Total Runs</span>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">🔗</div>
          <div className="stat-info">
            <span className="stat-value">0</span>
            <span className="stat-label">Connected Apps</span>
          </div>
        </div>
      </div>

      {/* Workflows Section */}
      <section className="workflows-section">
        <div className="section-header">
          <h2>Your Workflows</h2>
          <Link to="/workflows/new" className="btn btn-secondary btn-sm">
            Create New
          </Link>
        </div>

        {workflows.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">🔄</div>
            <h3>No workflows yet</h3>
            <p>Create your first workflow to start automating</p>
            <Link to="/workflows/new" className="btn btn-primary">
              Create Your First Workflow
            </Link>
          </div>
        ) : (
          <div className="workflows-list">
            {workflows.map(workflow => (
              <Link 
                key={workflow.id} 
                to={`/workflows/${workflow.id}/edit`}
                className="workflow-card card"
              >
                <div className="workflow-info">
                  <div className="workflow-header">
                    <h4>{workflow.name}</h4>
                    <span className={`badge ${workflow.is_active ? 'badge-success' : 'badge-warning'}`}>
                      {workflow.is_active ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <p className="workflow-description">
                    {workflow.description || 'No description'}
                  </p>
                  <div className="workflow-meta">
                    <span>
                      {workflow.trigger_app === 'airtable' && '📊'}
                      {workflow.trigger_app === 'notion' && '📝'}
                      {workflow.trigger_app === 'slack' && '💬'}
                      {workflow.trigger_app === 'gmail' && '📧'}
                      {workflow.trigger_app === 'twitter' && '🐦'}
                      {workflow.trigger_app === 'discord' && '🎮'}
                      {workflow.trigger_app === 'webhook' && '🪝'}
                      {' '}{workflow.trigger_app}
                    </span>
                    <span>•</span>
                    <span>{workflow.total_runs || 0} runs</span>
                    <span>•</span>
                    <span>
                      {workflow.last_run_at 
                        ? `Last run ${new Date(workflow.last_run_at).toLocaleDateString()}`
                        : 'Never run'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent Executions */}
      {recentExecutions.length > 0 && (
        <section className="executions-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <Link to="/dashboard/history" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>

          <div className="card">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Workflow</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExecutions.map(exec => (
                    <tr key={exec.id}>
                      <td>{exec.workflow_name || 'Unknown'}</td>
                      <td>
                        <span className={`badge badge-${exec.status === 'success' ? 'success' : exec.status === 'error' ? 'danger' : 'warning'}`}>
                          {exec.status}
                        </span>
                      </td>
                      <td>{new Date(exec.created_at).toLocaleString()}</td>
                      <td>{exec.execution_time_ms ? `${exec.execution_time_ms}ms` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
