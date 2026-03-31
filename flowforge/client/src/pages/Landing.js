import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">⚡</span>
              <span className="logo-text">FlowForge</span>
            </div>
            <nav className="header-nav">
              <Link to="/pricing">Pricing</Link>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">🚀</span>
              <span>No-Code Automation for Everyone</span>
            </div>
            <h1>Connect Any Tool.<br />Automate Any Workflow.</h1>
            <p className="hero-subtitle">
              Build powerful automations without writing a single line of code. 
              Connect Airtable, Notion, Slack, Gmail, Twitter, and Discord in minutes.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Start Building Free
              </Link>
              <Link to="/pricing" className="btn btn-secondary btn-lg">
                View Pricing
              </Link>
            </div>
            <p className="hero-hint">No credit card required • Free plan available</p>
          </div>
          
          <div className="hero-visual">
            <div className="workflow-preview">
              <div className="node trigger">
                <div className="node-icon">📊</div>
                <div className="node-info">
                  <span className="node-label">Trigger</span>
                  <span className="node-name">Airtable New Record</span>
                </div>
              </div>
              <div className="connector">
                <div className="connector-line"></div>
                <div className="connector-arrow">→</div>
              </div>
              <div className="node action">
                <div className="node-icon">💬</div>
                <div className="node-info">
                  <span className="node-label">Action</span>
                  <span className="node-name">Slack Notification</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need to Automate</h2>
            <p>Powerful features that make building automations feel effortless</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Visual Workflow Builder</h3>
              <p>Drag, drop, and connect. Build complex automations with our intuitive visual interface in minutes.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔌</div>
              <h3>6+ Integrations</h3>
              <p>Connect with Airtable, Notion, Slack, Gmail, Twitter, Discord, and webhooks. More coming soon.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Execution</h3>
              <p>Your workflows run in milliseconds. Real-time triggers and fast action execution.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Detailed Logs</h3>
              <p>Full execution history with detailed logs. Debug issues quickly and optimize performance.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure by Design</h3>
              <p>Enterprise-grade security. Encrypted tokens, secure webhooks, and OAuth protection.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Scalable Plans</h3>
              <p>Start free, upgrade when you grow. Flexible pricing that scales with your needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="integrations">
        <div className="container">
          <div className="section-header">
            <h2>Connect Your Favorite Tools</h2>
            <p>New integrations added regularly based on user requests</p>
          </div>
          
          <div className="integrations-grid">
            {['Airtable', 'Notion', 'Slack', 'Gmail', 'Twitter', 'Discord'].map((app) => (
              <div key={app} className="integration-card">
                <span className="integration-icon">
                  {app === 'Airtable' && '📊'}
                  {app === 'Notion' && '📝'}
                  {app === 'Slack' && '💬'}
                  {app === 'Gmail' && '📧'}
                  {app === 'Twitter' && '🐦'}
                  {app === 'Discord' && '🎮'}
                </span>
                <span className="integration-name">{app}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="templates">
        <div className="container">
          <div className="section-header">
            <h2>Ready-to-Use Templates</h2>
            <p>Jump-start your automation with pre-built templates</p>
          </div>
          
          <div className="templates-grid">
            <div className="template-card">
              <div className="template-flow">
                <span>📊</span>
                <span>→</span>
                <span>💬</span>
              </div>
              <h4>Airtable → Slack</h4>
              <p>Get Slack notifications for new Airtable records</p>
            </div>
            
            <div className="template-card">
              <div className="template-flow">
                <span>📝</span>
                <span>→</span>
                <span>📧</span>
              </div>
              <h4>Notion → Gmail</h4>
              <p>Send emails when Notion pages are created</p>
            </div>
            
            <div className="template-card">
              <div className="template-flow">
                <span>🐦</span>
                <span>→</span>
                <span>🎮</span>
              </div>
              <h4>Twitter → Discord</h4>
              <p>Welcome new Twitter followers in Discord</p>
            </div>
            
            <div className="template-card">
              <div className="template-flow">
                <span>📧</span>
                <span>→</span>
                <span>📝</span>
              </div>
              <h4>Gmail → Notion</h4>
              <p>Create Notion pages from emails</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Automate Your Workflow?</h2>
            <p>Join thousands of founders and teams who save hours every week with FlowForge.</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-icon">⚡</span>
                <span className="logo-text">FlowForge</span>
              </div>
              <p>No-Code Automation Bridge</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h5>Product</h5>
                <Link to="/pricing">Pricing</Link>
                <a href="#features">Features</a>
                <a href="#integrations">Integrations</a>
              </div>
              <div className="footer-column">
                <h5>Company</h5>
                <a href="#about">About</a>
                <a href="#blog">Blog</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="footer-column">
                <h5>Legal</h5>
                <a href="#privacy">Privacy</a>
                <a href="#terms">Terms</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 FlowForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
