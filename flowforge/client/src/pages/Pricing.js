import React from 'react';
import { Link } from 'react-router-dom';
import './Pricing.css';

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out FlowForge',
    features: [
      '3 workflows',
      '500 executions/month',
      '5 connected apps',
      'Community support',
      'Basic templates'
    ],
    limitations: [
      'Limited to 3 workflows'
    ],
    tier: 'free',
    popular: false
  },
  {
    name: 'Starter',
    price: 19,
    description: 'For solo founders and small teams',
    features: [
      '15 workflows',
      '5,000 executions/month',
      'Unlimited connected apps',
      'Email support',
      'All templates',
      'Webhook triggers'
    ],
    tier: 'starter',
    popular: true
  },
  {
    name: 'Pro',
    price: 49,
    description: 'For growing businesses',
    features: [
      '50 workflows',
      '25,000 executions/month',
      'Unlimited connected apps',
      'Priority support',
      'All templates',
      'Webhook triggers',
      'Advanced transforms'
    ],
    tier: 'pro',
    popular: false
  },
  {
    name: 'Business',
    price: 99,
    description: 'For teams with advanced needs',
    features: [
      'Unlimited workflows',
      '100,000 executions/month',
      'Unlimited connected apps',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'Team collaboration'
    ],
    tier: 'business',
    popular: false
  }
];

export default function Pricing() {
  return (
    <div className="pricing-page">
      <header className="pricing-header">
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">FlowForge</span>
          </Link>
        </div>
      </header>

      <section className="pricing-hero">
        <div className="container">
          <h1>Simple, Transparent Pricing</h1>
          <p>Start free, upgrade when you grow. No hidden fees.</p>
        </div>
      </section>

      <section className="pricing-plans">
        <div className="container">
          <div className="plans-grid">
            {plans.map((plan) => (
              <div 
                key={plan.tier} 
                className={`plan-card ${plan.popular ? 'popular' : ''}`}
              >
                {plan.popular && <span className="popular-badge">Most Popular</span>}
                <h3>{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">/month</span>
                </div>
                <ul className="plan-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <span className="check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/register" 
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>What counts as an execution?</h4>
              <p>Each time a workflow runs (from trigger to all actions completing) counts as one execution, regardless of how many actions it performs.</p>
            </div>
            <div className="faq-item">
              <h4>Can I change plans later?</h4>
              <p>Yes! You can upgrade or downgrade at any time. Changes take effect immediately.</p>
            </div>
            <div className="faq-item">
              <h4>What happens if I exceed my execution limit?</h4>
              <p>We'll notify you when you reach 80% of your limit. Once exceeded, workflows will pause until you upgrade or the next billing cycle.</p>
            </div>
            <div className="faq-item">
              <h4>Do unused executions roll over?</h4>
              <p>No, execution limits reset each billing cycle and don't roll over.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
