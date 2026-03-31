import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Billing.css';

const PLANS = [
  { tier: 'free', name: 'Free', price: 0, exec_limit: 500, workflows: 3 },
  { tier: 'starter', name: 'Starter', price: 19, exec_limit: 5000, workflows: 15 },
  { tier: 'pro', name: 'Pro', price: 49, exec_limit: 25000, workflows: 50 },
  { tier: 'business', name: 'Business', price: 99, exec_limit: 100000, workflows: Infinity }
];

export default function Billing() {
  const { user, token, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check for success/cancel from Stripe
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
      setMessage('Payment successful! Your plan has been upgraded.');
      window.history.replaceState({}, '', '/dashboard/billing');
    }
    if (params.get('canceled')) {
      setMessage('Payment canceled. No charges were made.');
      window.history.replaceState({}, '', '/dashboard/billing');
    }
  }, []);

  const handleSubscribe = async (tier) => {
    if (tier === user?.plan_tier) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan_tier: tier })
      });

      const data = await res.json();
      
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else if (data.message) {
        // Direct upgrade (no Stripe)
        updateUser({ plan_tier: tier, exec_limit: PLANS.find(p => p.tier === tier)?.exec_limit });
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will be downgraded to the Free plan.')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/billing/cancel', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        updateUser({ plan_tier: 'free', exec_limit: 500 });
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/billing/portal', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.portal_url) {
        window.location.href = data.portal_url;
      }
    } catch (err) {
      console.error('Portal error:', err);
    } finally {
      setPortalLoading(false);
    }
  };

  const currentPlan = PLANS.find(p => p.tier === user?.plan_tier) || PLANS[0];
  const usagePercent = user?.exec_limit ? Math.round((user.executions_used / user.exec_limit) * 100) : 0;

  return (
    <div className="billing-page">
      <div className="page-header">
        <div>
          <h1>Billing</h1>
          <p className="text-secondary">Manage your subscription and usage</p>
        </div>
      </div>

      {message && (
        <div className="notification notification-success mb-3">
          {message}
        </div>
      )}

      {/* Current Plan */}
      <div className="current-plan card mb-3">
        <div className="plan-header">
          <div>
            <span className="badge badge-info mb-1">{user?.plan_tier?.toUpperCase()}</span>
            <h2>{currentPlan.name} Plan</h2>
            <p className="text-secondary">
              ${currentPlan.price}/month • {currentPlan.exec_limit.toLocaleString()} executions
            </p>
          </div>
          {user?.stripe_customer_id && (
            <button 
              className="btn btn-secondary"
              onClick={handlePortal}
              disabled={portalLoading}
            >
              {portalLoading ? 'Loading...' : 'Billing Portal'}
            </button>
          )}
        </div>

        {/* Usage */}
        <div className="usage-section mt-3">
          <div className="flex-between mb-1">
            <span>Usage This Month</span>
            <span>{user?.executions_used?.toLocaleString()} / {user?.exec_limit?.toLocaleString()}</span>
          </div>
          <div className="usage-bar">
            <div 
              className="usage-fill"
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
        </div>

        {user?.plan_tier !== 'free' && (
          <button 
            className="btn btn-danger mt-3"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel Subscription
          </button>
        )}
      </div>

      {/* Plans */}
      <h2 className="mb-2">Available Plans</h2>
      <div className="plans-grid">
        {PLANS.map(plan => (
          <div 
            key={plan.tier}
            className={`plan-card card ${plan.tier === user?.plan_tier ? 'current' : ''}`}
          >
            {plan.tier === user?.plan_tier && (
              <span className="current-badge">Current Plan</span>
            )}
            <h3>{plan.name}</h3>
            <div className="plan-price">
              <span className="currency">$</span>
              <span className="amount">{plan.price}</span>
              <span className="period">/mo</span>
            </div>
            <ul className="plan-features">
              <li>{plan.exec_limit.toLocaleString()} executions/month</li>
              <li>{plan.workflows === Infinity ? 'Unlimited' : plan.workflows} workflows</li>
              <li>Unlimited integrations</li>
            </ul>
            <button
              className={`btn ${plan.tier === user?.plan_tier ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => handleSubscribe(plan.tier)}
              disabled={loading || plan.tier === user?.plan_tier}
            >
              {loading ? 'Processing...' : 
               plan.tier === user?.plan_tier ? 'Current Plan' :
               plan.price === 0 ? 'Downgrade' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
