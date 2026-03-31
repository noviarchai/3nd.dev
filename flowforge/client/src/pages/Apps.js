import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Apps.css';

const INTEGRATIONS = [
  { 
    id: 'airtable', 
    name: 'Airtable', 
    icon: '📊', 
    color: '#FCB400',
    description: 'Connect your Airtable bases and tables',
    fields: [{ name: 'Personal Access Token', key: 'access_token', type: 'password' }]
  },
  { 
    id: 'notion', 
    name: 'Notion', 
    icon: '📝', 
    color: '#000000',
    description: 'Access your Notion pages and databases',
    oauth: true
  },
  { 
    id: 'slack', 
    name: 'Slack', 
    icon: '💬', 
    color: '#4A154B',
    description: 'Send messages and manage channels',
    oauth: true
  },
  { 
    id: 'gmail', 
    name: 'Gmail', 
    icon: '📧', 
    color: '#EA4335',
    description: 'Send emails and manage your inbox',
    oauth: true
  },
  { 
    id: 'twitter', 
    name: 'Twitter', 
    icon: '🐦', 
    color: '#1DA1F2',
    description: 'Post tweets and manage DMs',
    oauth: true
  },
  { 
    id: 'discord', 
    name: 'Discord', 
    icon: '🎮', 
    color: '#5865F2',
    description: 'Send messages and manage server',
    oauth: true
  }
];

export default function Apps() {
  const { token } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [connectingOAuth, setConnectingOAuth] = useState(null);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/connected-apps', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApps(data.apps || []);
      }
    } catch (err) {
      console.error('Failed to fetch apps:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (appId) => {
    const integration = INTEGRATIONS.find(i => i.id === appId);
    
    if (integration.oauth) {
      setConnectingOAuth(appId);
      try {
        const res = await fetch(`/api/connected-apps/${appId}/oauth-url`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.auth_url) {
          window.location.href = data.auth_url;
        }
      } catch (err) {
        console.error('OAuth error:', err);
      } finally {
        setConnectingOAuth(null);
      }
    } else {
      setShowModal(integration);
      setFormData({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConnecting(showModal.id);

    try {
      const res = await fetch('/api/connected-apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          app_name: showModal.id,
          access_token: formData.access_token,
          metadata: { base_id: formData.base_id, table_id: formData.table_id }
        })
      });

      if (res.ok) {
        setShowModal(null);
        fetchApps();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to connect');
      }
    } catch (err) {
      alert('Failed to connect app');
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (appId) => {
    if (!confirm('Are you sure you want to disconnect this app?')) return;

    try {
      const res = await fetch(`/api/connected-apps/${appId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchApps();
      }
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  const isConnected = (appId) => apps.some(a => a.app_name === appId);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading apps...</p>
      </div>
    );
  }

  return (
    <div className="apps-page">
      <div className="page-header">
        <div>
          <h1>Connected Apps</h1>
          <p className="text-secondary">Manage your integrations</p>
        </div>
      </div>

      <div className="apps-grid">
        {INTEGRATIONS.map(integration => (
          <div 
            key={integration.id} 
            className={`app-card card ${isConnected(integration.id) ? 'connected' : ''}`}
          >
            <div className="app-header">
              <div 
                className="app-icon" 
                style={{ background: integration.color + '20' }}
              >
                {integration.icon}
              </div>
              {isConnected(integration.id) && (
                <span className="badge badge-success">Connected</span>
              )}
            </div>
            <h3>{integration.name}</h3>
            <p>{integration.description}</p>
            <button 
              className={`btn ${isConnected(integration.id) ? 'btn-danger' : 'btn-primary'}`}
              onClick={() => isConnected(integration.id) 
                ? handleDisconnect(apps.find(a => a.app_name === integration.id)?.id)
                : handleConnect(integration.id)
              }
              disabled={connectingOAuth === integration.id}
            >
              {connectingOAuth === integration.id 
                ? 'Redirecting...' 
                : isConnected(integration.id) ? 'Disconnect' : 'Connect'
              }
            </button>
          </div>
        ))}
      </div>

      {/* Modal for PAT-based connections */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Connect {showModal.name}</h3>
              <button className="modal-close" onClick={() => setShowModal(null)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              {showModal.fields?.map(field => (
                <div key={field.key} className="form-group">
                  <label className="form-label">{field.name}</label>
                  <input
                    type={field.type}
                    className="form-input"
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    placeholder={`Enter ${field.name.toLowerCase()}`}
                    required
                  />
                </div>
              ))}
              <button type="submit" className="btn btn-primary" disabled={connecting}>
                {connecting ? 'Connecting...' : 'Connect'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
