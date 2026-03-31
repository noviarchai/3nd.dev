// SupportForge - Main Application

const API_BASE = '/api';
let currentUser = null;
let currentWorkspace = null;
let ws = null;
let conversations = [];
let activeConversation = null;

// ============ UTILITY FUNCTIONS ============

function $(selector) { return document.querySelector(selector); }
function $$(selector) { return document.querySelectorAll(selector); }

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
  return date.toLocaleDateString();
}

function formatMessageTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message, type = 'info') {
  const container = $('.toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

async function api(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };
  
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
}

// ============ WEBSOCKET ============

function initWebSocket() {
  const token = localStorage.getItem('token');
  if (!token) return;

  ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`);
  
  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'auth', token }));
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    handleWebSocketMessage(msg);
  };

  ws.onclose = () => {
    setTimeout(initWebSocket, 3000);
  };
}

function handleWebSocketMessage(msg) {
  switch (msg.type) {
    case 'auth_success':
      ws.send(JSON.stringify({ type: 'join_workspace', workspaceId: currentWorkspace.id }));
      break;
    case 'conversation_created':
      loadConversations();
      showToast('New conversation started', 'info');
      break;
    case 'new_message':
    case 'message_update':
      if (activeConversation && activeConversation.id === msg.conversationId) {
        loadMessages(msg.conversationId);
      }
      loadConversations();
      break;
    case 'conversation_update':
      loadConversations();
      break;
    case 'dashboard_update':
      updateStats();
      break;
  }
}

// ============ AUTH ============

async function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const data = await api('/auth/me');
    currentUser = data.user;
    currentWorkspace = data.workspace;
    return true;
  } catch (err) {
    localStorage.removeItem('token');
    return false;
  }
}

async function login(email, password) {
  const data = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  localStorage.setItem('token', data.token);
  currentUser = data.user;
  currentWorkspace = data.workspace;
  return data;
}

async function register(email, password, name, workspaceName) {
  const data = await api('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, workspaceName })
  });
  
  localStorage.setItem('token', data.token);
  currentUser = data.user;
  currentWorkspace = data.workspace;
  return data;
}

function logout() {
  localStorage.removeItem('token');
  currentUser = null;
  currentWorkspace = null;
  if (ws) ws.close();
  renderLanding();
}

// ============ LANDING PAGE ============

function renderLanding() {
  $('#app').innerHTML = `
    <nav class="nav">
      <div class="nav-brand">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        SupportForge
      </div>
      <div class="nav-links">
        <a href="#features" class="nav-link">Features</a>
        <a href="#pricing" class="nav-link">Pricing</a>
        <a href="#docs" class="nav-link">Docs</a>
      </div>
      <div class="nav-actions">
        <button class="btn btn-secondary" onclick="showLogin()">Sign In</button>
        <button class="btn btn-primary" onclick="showRegister()">Get Started</button>
      </div>
    </nav>

    <section class="hero">
      <div class="hero-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
        Unlimited seats, flat pricing
      </div>
      <h1>Customer support that <span>doesn't punish growth</span></h1>
      <p>The flat-rate chat tool for teams who hate Intercom's per-seat pricing. One price, unlimited agents, powerful features.</p>
      <div class="hero-actions">
        <button class="btn btn-primary btn-lg" onclick="showRegister()">
          Start Free Trial
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
        <button class="btn btn-secondary btn-lg" onclick="showLogin()">Sign In</button>
      </div>
    </section>

    <section class="pricing-section" id="pricing">
      <div class="section-header">
        <h2>Simple, transparent pricing</h2>
        <p>No per-seat fees. No hidden costs. One price for your entire team.</p>
      </div>
      <div class="pricing-card featured">
        <div class="price">$49<span>/mo</span></div>
        <div class="price-period">Flat rate • Unlimited agents</div>
        <button class="btn btn-primary btn-lg" onclick="showRegister()" style="width:100%">Start 14-Day Free Trial</button>
        <p style="margin-top:16px;font-size:13px;color:var(--gray-500)">No credit card required</p>
        <div class="features-list">
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Unlimited agents &amp; team members</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Real-time WebSocket chat</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Embeddable chat widget</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Canned responses &amp; shortcuts</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Conversation history &amp; search</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Priority support</span>
          </div>
        </div>
      </div>
    </section>

    <section class="pricing-section" id="features" style="background:var(--gray-50)">
      <div class="section-header">
        <h2>Everything you need</h2>
        <p>Built for teams who want powerful support without the enterprise price tag.</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3>Real-time Chat</h3>
          <p>WebSocket-powered instant messaging. No delays, no refreshes.</p>
        </div>
        <div class="feature-card">
          <div class="feature-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
          </div>
          <h3>Chat Widget</h3>
          <p>Embeddable chat button. Drop-in code for any website.</p>
        </div>
        <div class="feature-card">
          <div class="feature-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3>Unlimited Seats</h3>
          <p>Add your whole team. Pricing never scales with headcount.</p>
        </div>
        <div class="feature-card">
          <div class="feature-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <h3>Analytics</h3>
          <p>Track response times, conversation volume, and team performance.</p>
        </div>
        <div class="feature-card">
          <div class="feature-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h3>Canned Responses</h3>
          <p>Quick-reply templates with keyboard shortcuts.</p>
        </div>
        <div class="feature-card">
          <div class="feature-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <h3>Billing Portal</h3>
          <p>Stripe-powered subscriptions. Self-serve invoice management.</p>
        </div>
      </div>
    </section>

    <div id="auth-modal"></div>
  `;
}

function showLogin() {
  $('#auth-modal').innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Sign In</h2>
          <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <form class="auth-form" onsubmit="handleLogin(event)">
          <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" required placeholder="you@company.com">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" name="password" required placeholder="Your password">
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%">Sign In</button>
        </form>
        <div class="form-divider">or</div>
        <p style="text-align:center;font-size:14px;color:var(--gray-500)">
          Don't have an account? <a href="#" onclick="showRegister();return false">Sign up</a>
        </p>
      </div>
    </div>
  `;
}

function showRegister() {
  $('#auth-modal').innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Create your workspace</h2>
          <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <form class="auth-form" onsubmit="handleRegister(event)">
          <div class="form-group">
            <label>Your Name</label>
            <input type="text" name="name" required placeholder="Jane Smith">
          </div>
          <div class="form-group">
            <label>Work Email</label>
            <input type="email" name="email" required placeholder="jane@company.com">
          </div>
          <div class="form-group">
            <label>Workspace Name</label>
            <input type="text" name="workspaceName" placeholder="My Company">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" name="password" required placeholder="Min 6 characters" minlength="6">
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%">Create Workspace</button>
          <p style="font-size:12px;color:var(--gray-400);text-align:center">14-day free trial. No credit card required.</p>
        </form>
        <div class="form-divider">or</div>
        <p style="text-align:center;font-size:14px;color:var(--gray-500)">
          Already have an account? <a href="#" onclick="showLogin();return false">Sign in</a>
        </p>
      </div>
    </div>
  `;
}

function closeModal(e) {
  if (e && e.target !== e.currentTarget) return;
  $('#auth-modal').innerHTML = '';
}

async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  
  try {
    btn.disabled = true;
    btn.textContent = 'Signing in...';
    await login(form.email.value, form.password.value);
    closeModal();
    renderDashboard();
    initWebSocket();
    showToast('Welcome back!', 'success');
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  
  try {
    btn.disabled = true;
    btn.textContent = 'Creating...';
    await register(form.email.value, form.password.value, form.name.value, form.workspaceName.value);
    closeModal();
    renderDashboard();
    initWebSocket();
    showToast('Workspace created!', 'success');
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Create Workspace';
  }
}

// ============ DASHBOARD ============

async function renderDashboard() {
  $('#app').innerHTML = `
    <nav class="nav">
      <div class="nav-brand">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        SupportForge
      </div>
      <div class="nav-actions">
        <span class="text-sm text-muted">${escapeHtml(currentWorkspace?.name || '')}</span>
        <button class="btn btn-ghost btn-sm" onclick="renderSettings()">Settings</button>
        <button class="btn btn-secondary btn-sm" onclick="logout()">Sign Out</button>
      </div>
    </nav>

    <div class="dashboard">
      <aside class="sidebar">
        <div class="sidebar-section">
          <div class="sidebar-section-title">Workspace</div>
          <a class="sidebar-link active" onclick="showConversations()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Conversations
            <span class="badge" id="open-count">0</span>
          </a>
          <a class="sidebar-link" onclick="showBilling()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Billing
          </a>
          <a class="sidebar-link" onclick="showTeam()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Team
          </a>
        </div>
        <div class="sidebar-section">
          <div class="sidebar-section-title">Settings</div>
          <a class="sidebar-link" onclick="renderSettings()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Widget Settings
          </a>
          <a class="sidebar-link" onclick="showCannedResponses()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Canned Responses
          </a>
        </div>
        <div class="sidebar-section">
          <div class="sidebar-section-title">Widget Code</div>
          <a class="sidebar-link" onclick="showWidgetCode()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Install Widget
          </a>
        </div>
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">${getInitials(currentUser?.name || 'U')}</div>
            <div>
              <div class="user-name">${escapeHtml(currentUser?.name || '')}</div>
              <div class="user-role">${escapeHtml(currentUser?.role || '')}</div>
            </div>
          </div>
        </div>
      </aside>

      <main class="main-content" id="main-content">
        <!-- Dynamic content loads here -->
      </main>
    </div>
  `;

  await loadConversations();
  await updateStats();
}

async function loadConversations() {
  try {
    const data = await api('/conversations');
    conversations = data.conversations;
    
    $('#open-count').textContent = data.conversations.filter(c => c.status === 'open').length;
    
    if (activeConversation) {
      renderChatView(activeConversation);
    } else {
      showConversations();
    }
  } catch (err) {
    showToast('Failed to load conversations', 'error');
  }
}

async function updateStats() {
  try {
    const stats = await api('/conversations/stats/dashboard');
    const statsEl = $('#stats-grid');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat-card">
          <div class="stat-card-label">Open</div>
          <div class="stat-card-value">${stats.open}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">My Conversations</div>
          <div class="stat-card-value">${stats.myConversations}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Unassigned</div>
          <div class="stat-card-value">${stats.unassigned}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">Total Customers</div>
          <div class="stat-card-value">${stats.totalCustomers}</div>
        </div>
      `;
    }
  } catch (err) {
    console.error('Failed to update stats:', err);
  }
}

function showConversations() {
  $$('.sidebar-link').forEach(l => l.classList.remove('active'));
  $('.sidebar-link[onclick="showConversations()"]').classList.add('active');
  
  const main = $('#main-content');
  main.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Conversations</h1>
      <div class="page-actions">
        <div class="conversations-filters">
          <button class="filter-btn active" data-filter="all" onclick="filterConversations('all')">All</button>
          <button class="filter-btn" data-filter="open" onclick="filterConversations('open')">Open</button>
          <button class="filter-btn" data-filter="pending" onclick="filterConversations('pending')">Pending</button>
          <button class="filter-btn" data-filter="closed" onclick="filterConversations('closed')">Closed</button>
        </div>
      </div>
    </div>
    <div class="page-content">
      <div class="stats-grid" id="stats-grid"></div>
      <div class="conversations-list" id="conversations-list">
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3>No conversations yet</h3>
          <p>Conversations from your chat widget will appear here.</p>
        </div>
      </div>
    </div>
  `;
  
  updateStats();
  renderConversationsList();
}

function filterConversations(filter) {
  $$('.filter-btn').forEach(b => b.classList.remove('active'));
  $(`.filter-btn[data-filter="${filter}"]`).classList.add('active');
  renderConversationsList(filter);
}

function renderConversationsList(filter = 'all') {
  const list = $('#conversations-list');
  if (!list) return;

  const filtered = filter === 'all' 
    ? conversations 
    : conversations.filter(c => c.status === filter);

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <h3>No ${filter} conversations</h3>
        <p>${filter === 'all' ? 'Conversations will appear here when customers start chatting.' : `No conversations with status "${filter}".`}</p>
      </div>
    `;
    return;
  }

  list.innerHTML = filtered.map(conv => `
    <div class="conversation-item ${activeConversation?.id === conv.id ? 'active' : ''}" onclick="openConversation('${conv.id}')">
      <div class="conversation-avatar">${getInitials(conv.customer_name || 'C')}</div>
      <div class="conversation-info">
        <div class="conversation-name">
          ${escapeHtml(conv.customer_name || 'Unknown')}
          ${conv.priority === 'high' ? '<span style="color:var(--danger)">●</span>' : ''}
        </div>
        <div class="conversation-preview">${conv.subject || conv.last_message || 'New conversation'}</div>
      </div>
      <div class="conversation-meta">
        <div class="conversation-time">${formatTime(conv.updated_at)}</div>
        <span class="conversation-status ${conv.status}">${conv.status}</span>
      </div>
    </div>
  `).join('');
}

async function openConversation(id) {
  const conv = conversations.find(c => c.id === id);
  if (!conv) return;
  
  activeConversation = conv;
  renderChatView(conv);
}

async function renderChatView(conv) {
  $$('.sidebar-link').forEach(l => l.classList.remove('active'));
  $('.sidebar-link[onclick="showConversations()"]').classList.add('active');

  const main = $('#main-content');
  main.innerHTML = `
    <div class="chat-layout">
      <div class="chat-sidebar">
        <div class="conversations-list" style="border:none;box-shadow:none">
          <div class="conversations-header">
            <span style="font-weight:600">Conversations</span>
          </div>
          <div id="chat-conversations-list"></div>
        </div>
      </div>
      <div class="chat-main">
        <div class="chat-header">
          <div class="chat-header-info">
            <h2>${escapeHtml(conv.customer_name || 'Customer')}</h2>
            <p>${escapeHtml(conv.subject || 'New conversation')} · ${formatTime(conv.created_at)}</p>
          </div>
          <div class="page-actions">
            <select class="form-group" style="padding:8px 12px;border-radius:var(--radius)" onchange="updateConversationStatus('${conv.id}', this.value)">
              <option value="open" ${conv.status === 'open' ? 'selected' : ''}>Open</option>
              <option value="pending" ${conv.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="closed" ${conv.status === 'closed' ? 'selected' : ''}>Closed</option>
            </select>
            <select class="form-group" style="padding:8px 12px;border-radius:var(--radius)" onchange="assignConversation('${conv.id}', this.value)">
              <option value="">Unassigned</option>
            </select>
          </div>
        </div>
        <div class="chat-messages" id="chat-messages"></div>
        <div class="chat-input-area">
          <div class="chat-input-wrapper">
            <textarea class="chat-input" id="message-input" placeholder="Type a message..." rows="1" onkeydown="handleMessageKeydown(event)"></textarea>
            <button class="btn btn-primary" onclick="sendMessage()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Render conversation list in sidebar
  const chatList = $('#chat-conversations-list');
  chatList.innerHTML = conversations.map(c => `
    <div class="conversation-item ${activeConversation?.id === c.id ? 'active' : ''}" onclick="openConversation('${c.id}')">
      <div class="conversation-avatar">${getInitials(c.customer_name || 'C')}</div>
      <div class="conversation-info">
        <div class="conversation-name">${escapeHtml(c.customer_name || 'Unknown')}</div>
        <div class="conversation-preview">${c.subject || ''}</div>
      </div>
    </div>
  `).join('');

  await loadMessages(conv.id);
}

async function loadMessages(conversationId) {
  try {
    const data = await api(`/conversations/${conversationId}`);
    renderMessages(data.messages);
  } catch (err) {
    showToast('Failed to load messages', 'error');
  }
}

function renderMessages(messages) {
  const container = $('#chat-messages');
  if (!container) return;

  container.innerHTML = messages.map(msg => `
    <div class="message ${msg.sender_type === 'agent' || msg.sender_type === 'admin' ? 'own' : 'other'}">
      ${msg.sender_name ? `<div class="message-sender">${escapeHtml(msg.sender_name)}</div>` : ''}
      <div class="message-bubble">${escapeHtml(msg.content)}</div>
      <div class="message-time">${formatMessageTime(msg.created_at)}</div>
    </div>
  `).join('');

  container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
  const input = $('#message-input');
  if (!input || !input.value.trim()) return;
  if (!activeConversation) return;

  const content = input.value.trim();
  input.value = '';

  try {
    await api(`/conversations/${activeConversation.id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
    await loadMessages(activeConversation.id);
    await loadConversations();
  } catch (err) {
    showToast('Failed to send message', 'error');
    input.value = content;
  }
}

function handleMessageKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

async function updateConversationStatus(id, status) {
  try {
    await api(`/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    await loadConversations();
    if (activeConversation?.id === id) {
      activeConversation.status = status;
    }
    showToast(`Conversation marked as ${status}`, 'success');
  } catch (err) {
    showToast('Failed to update status', 'error');
  }
}

async function assignConversation(id, userId) {
  try {
    await api(`/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ assignedTo: userId || null })
    });
    await loadConversations();
    showToast('Conversation assigned', 'success');
  } catch (err) {
    showToast('Failed to assign conversation', 'error');
  }
}

// ============ BILLING ============

async function showBilling() {
  $$('.sidebar-link').forEach(l => l.classList.remove('active'));
  $('.sidebar-link[onclick="showBilling()"]').classList.add('active');

  try {
    const [billing, invoices] = await Promise.all([
      api('/billing'),
      api('/billing/invoices')
    ]);

    $('#main-content').innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Billing</h1>
      </div>
      <div class="page-content">
        <div class="billing-card">
          <div class="billing-header">
            <h3>Current Plan</h3>
            <span class="billing-status ${billing.subscriptionStatus}">${billing.subscriptionStatus}</span>
          </div>
          <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:24px">
            <span style="font-size:48px;font-weight:800">$${billing.price}</span>
            <span style="color:var(--gray-500)">/month · flat rate</span>
          </div>
          <p style="color:var(--gray-500);margin-bottom:24px">Unlimited agents, unlimited seats. Never pay per-seat pricing again.</p>
          ${billing.hasSubscription ? `
            <button class="btn btn-secondary" onclick="openBillingPortal()">Manage Subscription</button>
          ` : `
            <button class="btn btn-primary" onclick="startCheckout()">Upgrade to Pro</button>
          `}
        </div>

        ${invoices.invoices.length > 0 ? `
          <div class="billing-card">
            <h3 style="margin-bottom:16px">Invoice History</h3>
            <div class="invoices-list">
              ${invoices.invoices.map(inv => `
                <div class="invoice-item">
                  <div>
                    <div class="invoice-date">${new Date(inv.date).toLocaleDateString()}</div>
                    <div class="text-sm text-muted">${inv.number}</div>
                  </div>
                  <div style="text-align:right">
                    <div class="invoice-amount">$${inv.amount.toFixed(2)}</div>
                    ${inv.pdf ? `<a href="${inv.pdf}" target="_blank" class="text-sm">Download PDF</a>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  } catch (err) {
    showToast('Failed to load billing info', 'error');
  }
}

async function startCheckout() {
  try {
    const { url } = await api('/billing/checkout', { method: 'POST' });
    window.location.href = url;
  } catch (err) {
    showToast('Failed to start checkout', 'error');
  }
}

async function openBillingPortal() {
  try {
    const { url } = await api('/billing/portal', { method: 'POST' });
    window.location.href = url;
  } catch (err) {
    showToast('Failed to open billing portal', 'error');
  }
}

// ============ TEAM ============

async function showTeam() {
  $$('.sidebar-link').forEach(l => l.classList.remove('active'));
  $('.sidebar-link[onclick="showTeam()"]').classList.add('active');

  try {
    const { members } = await api('/auth/team');

    $('#main-content').innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Team</h1>
        <button class="btn btn-primary" onclick="showInviteModal()">Invite Member</button>
      </div>
      <div class="page-content">
        <div class="team-list">
          ${members.map(m => `
            <div class="team-member">
              <div class="user-avatar">${getInitials(m.name)}</div>
              <div class="team-member-info">
                <div class="team-member-name">${escapeHtml(m.name)}</div>
                <div class="team-member-email">${escapeHtml(m.email)}</div>
              </div>
              <span class="role-badge ${m.role}">${m.role}</span>
              ${m.id !== currentUser.id && currentUser.role === 'admin' ? `
                <button class="btn btn-ghost btn-sm" onclick="removeTeamMember('${m.id}')">Remove</button>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (err) {
    showToast('Failed to load team', 'error');
  }
}

function showInviteModal() {
  $('#app').insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" onclick="this.remove()">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Invite Team Member</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <form onsubmit="handleInvite(event)">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" name="email" required placeholder="colleague@company.com">
          </div>
          <div class="form-group">
            <label>Role</label>
            <select name="role" style="padding:12px 14px;border:1px solid var(--gray-300);border-radius:var(--radius);width:100%">
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%">Send Invitation</button>
        </form>
      </div>
    </div>
  `);
}

async function handleInvite(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  
  try {
    btn.disabled = true;
    btn.textContent = 'Sending...';
    const data = await api('/auth/invite', {
      method: 'POST',
      body: JSON.stringify({
        email: form.email.value,
        role: form.role.value
      })
    });
    
    showToast('Invitation sent!', 'success');
    $('.modal-overlay')?.remove();
    
    // Show invite link for demo
    prompt('Invitation link:', `${window.location.origin}/invite/${data.token}`);
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Send Invitation';
  }
}

async function removeTeamMember(userId) {
  if (!confirm('Remove this team member?')) return;
  
  try {
    await api(`/auth/team/${userId}`, { method: 'DELETE' });
    showTeam();
    showToast('Team member removed', 'success');
  } catch (err) {
    showToast('Failed to remove team member', 'error');
  }
}

// ============ SETTINGS ============

async function renderSettings() {
  $$('.sidebar-link').forEach(l => l.classList.remove('active'));
  $('.sidebar-link[onclick="renderSettings()"]').classList.add('active');

  try {
    const data = await api('/settings');

    $('#main-content').innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Widget Settings</h1>
      </div>
      <div class="page-content">
        <div class="settings-grid">
          <nav class="settings-nav">
            <div class="settings-nav-item active">Appearance</div>
            <div class="settings-nav-item">Messages</div>
            <div class="settings-nav-item">Integrations</div>
          </nav>
          <div class="settings-content">
            <div class="settings-section">
              <h3>Widget Color</h3>
              <p>Customize the chat button and theme color</p>
              <div class="color-options">
                <div class="color-option selected" style="background:#6366f1" data-color="#6366f1" onclick="selectColor(this)"></div>
                <div class="color-option" style="background:#10b981" data-color="#10b981" onclick="selectColor(this)"></div>
                <div class="color-option" style="background:#f59e0b" data-color="#f59e0b" onclick="selectColor(this)"></div>
                <div class="color-option" style="background:#ef4444" data-color="#ef4444" onclick="selectColor(this)"></div>
                <div class="color-option" style="background:#8b5cf6" data-color="#8b5cf6" onclick="selectColor(this)"></div>
                <div class="color-option" style="background:#ec4899" data-color="#ec4899" onclick="selectColor(this)"></div>
              </div>
            </div>
            <div class="settings-section">
              <h3>Welcome Message</h3>
              <p>Greet your customers when they open the chat</p>
              <textarea class="form-group" rows="3" style="width:100%;padding:12px;border:1px solid var(--gray-300);border-radius:var(--radius);font-family:inherit" id="welcome-message">${escapeHtml(data.welcome_message || '')}</textarea>
            </div>
            <div class="settings-section">
              <h3>Widget Position</h3>
              <p>Where should the chat button appear?</p>
              <select class="form-group" style="padding:12px 14px;border:1px solid var(--gray-300);border-radius:var(--radius);width:100%;max-width:200px" id="widget-position">
                <option value="right" ${data.widget_position === 'right' ? 'selected' : ''}>Bottom Right</option>
                <option value="left" ${data.widget_position === 'left' ? 'selected' : ''}>Bottom Left</option>
              </select>
            </div>
            <button class="btn btn-primary" onclick="saveSettings()">Save Changes</button>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    showToast('Failed to load settings', 'error');
  }
}

function selectColor(el) {
  $$('.color-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

async function saveSettings() {
  const color = $('.color-option.selected')?.dataset.color;
  const welcome = $('#welcome-message')?.value;
  const position = $('#widget-position')?.value;

  try {
    await api('/settings', {
      method: 'PUT',
      body: JSON.stringify({
        widgetColor: color,
        welcomeMessage: welcome,
        widgetPosition: position
      })
    });
    showToast('Settings saved!', 'success');
  } catch (err) {
    showToast('Failed to save settings', 'error');
  }
}

// ============ CANNED RESPONSES ============

async function showCannedResponses() {
  $$('.sidebar-link').forEach(l => l.classList.remove('active'));
  $('.sidebar-link[onclick="showCannedResponses()"]').classList.add('active');

  try {
    const data = await api('/settings/canned-responses');

    $('#main-content').innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Canned Responses</h1>
        <button class="btn btn-primary" onclick="showCannedResponseModal()">Add Response</button>
      </div>
      <div class="page-content">
        ${data.responses.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <h3>No canned responses yet</h3>
            <p>Create quick-reply templates for common questions.</p>
          </div>
        ` : data.responses.map(r => `
          <div class="canned-response-item">
            <span class="canned-shortcut">/${escapeHtml(r.shortcut)}</span>
            <div class="canned-content">${escapeHtml(r.content)}</div>
            <button class="btn btn-ghost btn-sm" onclick="deleteCannedResponse('${r.id}')">Delete</button>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    showToast('Failed to load canned responses', 'error');
  }
}

function showCannedResponseModal() {
  $('#app').insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" onclick="this.remove()">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Add Canned Response</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <form onsubmit="handleCreateCannedResponse(event)">
          <div class="form-group">
            <label>Shortcut</label>
            <input type="text" name="shortcut" required placeholder="greeting" style="padding:12px 14px;border:1px solid var(--gray-300);border-radius:var(--radius);width:100%">
            <small style="color:var(--gray-400)">Type /shortcut in chat to use</small>
          </div>
          <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" placeholder="Friendly greeting" style="padding:12px 14px;border:1px solid var(--gray-300);border-radius:var(--radius);width:100%">
          </div>
          <div class="form-group">
            <label>Response</label>
            <textarea name="content" required rows="4" placeholder="Hi there! How can we help you today?" style="padding:12px 14px;border:1px solid var(--gray-300);border-radius:var(--radius);width:100%;font-family:inherit;resize:vertical"></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%">Create Response</button>
        </form>
      </div>
    </div>
  `);
}

async function handleCreateCannedResponse(e) {
  e.preventDefault();
  const form = e.target;
  
  try {
    await api('/settings/canned-responses', {
      method: 'POST',
      body: JSON.stringify({
        shortcut: form.shortcut.value,
        title: form.title.value,
        content: form.content.value
      })
    });
    showToast('Canned response created!', 'success');
    $('.modal-overlay')?.remove();
    showCannedResponses();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteCannedResponse(id) {
  if (!confirm('Delete this canned response?')) return;
  
  try {
    await api(`/settings/canned-responses/${id}`, { method: 'DELETE' });
    showCannedResponses();
    showToast('Canned response deleted', 'success');
  } catch (err) {
    showToast('Failed to delete', 'error');
  }
}

// ============ WIDGET CODE ============

function showWidgetCode() {
  $$('.sidebar-link').forEach(l => l.classList.remove('active'));
  $('.sidebar-link[onclick="showWidgetCode()"]').classList.add('active');

  const widgetCode = `<!-- SupportForge Widget -->
<script>
  window.SupportForge = {
    workspaceId: '${currentWorkspace?.id}',
    color: '#6366f1',
    position: 'right'
  };
</script>
<script src="${window.location.origin}/widget.js" async></script>`;

  $('#main-content').innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Install Chat Widget</h1>
    </div>
    <div class="page-content">
      <div class="settings-content" style="max-width:800px">
        <div class="settings-section">
          <h3>Add the widget to your website</h3>
          <p>Copy and paste this code just before the closing </head> tag on your website.</p>
          <pre style="background:var(--gray-900);color:#e5e7eb;padding:20px;border-radius:var(--radius);overflow-x:auto;font-size:13px;margin-top:16px">${escapeHtml(widgetCode)}</pre>
          <button class="btn btn-secondary" style="margin-top:12px" onclick="copyWidgetCode()">Copy Code</button>
        </div>
      </div>
    </div>
  `;
}

function copyWidgetCode() {
  const code = $('#main-content pre').textContent;
  navigator.clipboard.writeText(code);
  showToast('Code copied!', 'success');
}

// ============ INIT ============

async function init() {
  const isLoggedIn = await checkAuth();
  
  if (isLoggedIn) {
    renderDashboard();
    initWebSocket();
  } else {
    renderLanding();
  }
}

init();
