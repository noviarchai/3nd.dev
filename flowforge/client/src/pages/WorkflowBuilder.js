import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './WorkflowBuilder.css';

const INTEGRATIONS = {
  airtable: { name: 'Airtable', icon: '📊', color: '#FCB400' },
  notion: { name: 'Notion', icon: '📝', color: '#000000' },
  slack: { name: 'Slack', icon: '💬', color: '#4A154B' },
  gmail: { name: 'Gmail', icon: '📧', color: '#EA4335' },
  twitter: { name: 'Twitter', icon: '🐦', color: '#1DA1F2' },
  discord: { name: 'Discord', icon: '🎮', color: '#5865F2' },
  webhook: { name: 'Webhook', icon: '🪝', color: '#6366F1' }
};

const TRIGGERS = {
  airtable: [
    { type: 'new_record', label: 'New Record' },
    { type: 'record_updated', label: 'Record Updated' }
  ],
  notion: [
    { type: 'page_created', label: 'Page Created' },
    { type: 'page_updated', label: 'Page Updated' }
  ],
  slack: [
    { type: 'new_message', label: 'New Message' }
  ],
  gmail: [
    { type: 'new_email', label: 'New Email' },
    { type: 'new_attachment', label: 'New Attachment' }
  ],
  twitter: [
    { type: 'new_follower', label: 'New Follower' },
    { type: 'new_mention', label: 'New Mention' }
  ],
  discord: [
    { type: 'new_message', label: 'New Message' },
    { type: 'member_joined', label: 'Member Joined' }
  ],
  webhook: [
    { type: 'incoming', label: 'Incoming Webhook' }
  ]
};

const ACTIONS = {
  airtable: [
    { type: 'create_record', label: 'Create Record' },
    { type: 'update_record', label: 'Update Record' },
    { type: 'delete_record', label: 'Delete Record' }
  ],
  notion: [
    { type: 'create_page', label: 'Create Page' },
    { type: 'update_page', label: 'Update Page' },
    { type: 'add_database_row', label: 'Add to Database' }
  ],
  slack: [
    { type: 'send_message', label: 'Send Message' },
    { type: 'create_channel', label: 'Create Channel' }
  ],
  gmail: [
    { type: 'send_email', label: 'Send Email' },
    { type: 'apply_label', label: 'Apply Label' }
  ],
  twitter: [
    { type: 'post_tweet', label: 'Post Tweet' },
    { type: 'send_dm', label: 'Send DM' },
    { type: 'retweet', label: 'Retweet' }
  ],
  discord: [
    { type: 'send_message', label: 'Send Message' },
    { type: 'create_channel', label: 'Create Channel' }
  ],
  webhook: [
    { type: 'http_request', label: 'HTTP Request' }
  ]
};

export default function WorkflowBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();
  const isEditing = Boolean(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerApp, setTriggerApp] = useState('');
  const [triggerType, setTriggerType] = useState('');
  const [triggerConfig, setTriggerConfig] = useState({});
  const [actions, setActions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      fetchWorkflow();
    }
  }, [id]);

  const fetchWorkflow = async () => {
    try {
      const res = await fetch(`/api/workflows/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const wf = data.workflow;
        setName(wf.name);
        setDescription(wf.description || '');
        setTriggerApp(wf.trigger_app);
        setTriggerType(wf.trigger_type);
        setTriggerConfig(wf.trigger_config || {});
        setActions(wf.actions || []);
      }
    } catch (err) {
      console.error('Failed to fetch workflow:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !triggerApp || !triggerType) {
      alert('Please fill in required fields');
      return;
    }

    setSaving(true);

    try {
      const url = isEditing ? `/api/workflows/${id}` : '/api/workflows';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          trigger_app: triggerApp,
          trigger_type: triggerType,
          trigger_config: triggerConfig,
          actions
        })
      });

      if (res.ok) {
        navigate('/dashboard');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save workflow');
      }
    } catch (err) {
      alert('Failed to save workflow');
    } finally {
      setSaving(false);
    }
  };

  const addAction = () => {
    setActions([...actions, { app: '', type: '', config: {} }]);
  };

  const removeAction = (index) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const updateAction = (index, field, value) => {
    const updated = [...actions];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'app') {
      updated[index].type = '';
      updated[index].config = {};
    }
    setActions(updated);
  };

  const updateActionConfig = (index, config) => {
    const updated = [...actions];
    updated[index].config = { ...updated[index].config, ...config };
    setActions(updated);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading workflow...</p>
      </div>
    );
  }

  return (
    <div className="workflow-builder">
      <div className="builder-header">
        <div>
          <h1>{isEditing ? 'Edit Workflow' : 'Create Workflow'}</h1>
          <p className="text-secondary">
            {isEditing ? 'Update your automation workflow' : 'Build a new automation from scratch'}
          </p>
        </div>
        <div className="builder-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Workflow'}
          </button>
        </div>
      </div>

      <div className="builder-content">
        {/* Basic Info */}
        <div className="card mb-3">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label className="form-label">Workflow Name *</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., New Airtable Record → Slack Alert"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this workflow do?"
              rows={2}
            />
          </div>
        </div>

        {/* Trigger */}
        <div className="card mb-3">
          <h3>⚡ Trigger</h3>
          <p className="text-secondary mb-2">When should this workflow run?</p>
          
          <div className="integration-select">
            <label className="form-label">Select App</label>
            <div className="app-grid">
              {Object.entries(INTEGRATIONS).map(([key, app]) => (
                <button
                  key={key}
                  className={`app-option ${triggerApp === key ? 'selected' : ''}`}
                  onClick={() => setTriggerApp(key)}
                  style={{ '--app-color': app.color }}
                >
                  <span className="app-icon">{app.icon}</span>
                  <span className="app-name">{app.name}</span>
                </button>
              ))}
            </div>
          </div>

          {triggerApp && (
            <div className="trigger-config mt-3">
              <label className="form-label">Trigger Event</label>
              <select
                className="form-select"
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value)}
              >
                <option value="">Select trigger...</option>
                {TRIGGERS[triggerApp]?.map(t => (
                  <option key={t.type} value={t.type}>{t.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="card mb-3">
          <div className="flex-between mb-2">
            <h3>🎯 Actions</h3>
            <button className="btn btn-secondary btn-sm" onClick={addAction}>
              + Add Action
            </button>
          </div>
          <p className="text-secondary mb-3">What should happen when the trigger fires?</p>

          {actions.length === 0 ? (
            <div className="empty-actions">
              <p>No actions yet. Click "Add Action" to get started.</p>
            </div>
          ) : (
            <div className="actions-list">
              {actions.map((action, index) => (
                <div key={index} className="action-item card-elevated">
                  <div className="action-header">
                    <span className="action-number">{index + 1}</span>
                    <span className="text-muted">→</span>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => removeAction(index)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="action-body">
                    <div className="form-group">
                      <label className="form-label">App</label>
                      <select
                        className="form-select"
                        value={action.app}
                        onChange={(e) => updateAction(index, 'app', e.target.value)}
                      >
                        <option value="">Select app...</option>
                        {Object.entries(INTEGRATIONS).map(([key, app]) => (
                          <option key={key} value={key}>{app.icon} {app.name}</option>
                        ))}
                      </select>
                    </div>

                    {action.app && (
                      <div className="form-group">
                        <label className="form-label">Action</label>
                        <select
                          className="form-select"
                          value={action.type}
                          onChange={(e) => updateAction(index, 'type', e.target.value)}
                        >
                          <option value="">Select action...</option>
                          {ACTIONS[action.app]?.map(a => (
                            <option key={a.type} value={a.type}>{a.label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
