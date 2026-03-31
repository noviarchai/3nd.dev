import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './History.css';

export default function History() {
  const { token } = useAuth();
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', workflow_id: '' });
  const [pagination, setPagination] = useState({ total: 0, limit: 50, offset: 0 });

  useEffect(() => {
    fetchExecutions();
  }, [filter]);

  const fetchExecutions = async (offset = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: pagination.limit,
        offset
      });
      if (filter.status) params.set('status', filter.status);
      if (filter.workflow_id) params.set('workflow_id', filter.workflow_id);

      const res = await fetch(`/api/executions?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setExecutions(data.executions || []);
        setPagination(prev => ({ ...prev, total: data.total, offset }));
      }
    } catch (err) {
      console.error('Failed to fetch executions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (executionId) => {
    try {
      const res = await fetch(`/api/executions/${executionId}/retry`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchExecutions(pagination.offset);
      }
    } catch (err) {
      console.error('Retry failed:', err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const formatDuration = (ms) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <div>
          <h1>Execution History</h1>
          <p className="text-secondary">View your workflow execution logs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters card mb-3">
        <div className="filter-group">
          <label className="form-label">Status</label>
          <select 
            className="form-select"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
            <option value="partial">Partial</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Executions Table */}
      <div className="card">
        {loading ? (
          <div className="loading-screen">
            <div className="loading-spinner"></div>
          </div>
        ) : executions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📜</div>
            <h3>No executions yet</h3>
            <p>Your workflow execution history will appear here</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Workflow</th>
                    <th>Status</th>
                    <th>Executed</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {executions.map(exec => (
                    <tr key={exec.id}>
                      <td>
                        <div className="workflow-name">
                          {exec.workflow_name || 'Unknown'}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${
                          exec.status === 'success' ? 'success' :
                          exec.status === 'error' ? 'danger' :
                          exec.status === 'partial' ? 'warning' : 'info'
                        }`}>
                          {exec.status}
                        </span>
                      </td>
                      <td>{formatDate(exec.created_at)}</td>
                      <td>{formatDuration(exec.execution_time_ms)}</td>
                      <td>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleRetry(exec.id)}
                          disabled={exec.status !== 'error'}
                        >
                          Retry
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <span className="text-muted">
                Showing {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
              </span>
              <div className="pagination-controls">
                <button 
                  className="btn btn-secondary btn-sm"
                  disabled={pagination.offset === 0}
                  onClick={() => fetchExecutions(pagination.offset - pagination.limit)}
                >
                  Previous
                </button>
                <button 
                  className="btn btn-secondary btn-sm"
                  disabled={pagination.offset + pagination.limit >= pagination.total}
                  onClick={() => fetchExecutions(pagination.offset + pagination.limit)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
