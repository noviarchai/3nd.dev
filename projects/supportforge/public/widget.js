// SupportForge Chat Widget
// Embeddable customer support chat for websites

(function() {
  'use strict';

  const config = window.SupportForge || {};
  const workspaceId = config.workspaceId;
  const color = config.color || '#6366f1';
  const position = config.position || 'right';

  if (!workspaceId) {
    console.error('SupportForge: workspaceId is required');
    return;
  }

  let widgetConfig = null;
  let isOpen = false;
  let conversationId = null;
  let customerId = null;
  let ws = null;
  let messages = [];
  let unreadCount = 0;

  // Styles
  const styles = `
    .sf-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .sf-widget-button {
      position: fixed;
      ${position}: 24px;
      bottom: 24px;
      width: 60px;
      height: 60px;
      background: ${color};
      border-radius: 50%;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
      z-index: 999998;
    }
    .sf-widget-button:hover { transform: scale(1.05); box-shadow: 0 6px 25px rgba(0,0,0,0.25); }
    .sf-widget-button svg { width: 28px; height: 28px; color: white; }
    .sf-widget-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #ef4444;
      color: white;
      font-size: 12px;
      font-weight: 700;
      min-width: 20px;
      height: 20px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
    }
    .sf-widget-window {
      position: fixed;
      ${position}: 24px;
      bottom: 96px;
      width: 380px;
      height: 520px;
      max-height: calc(100vh - 120px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 999999;
      animation: sf-slideUp 0.3s ease;
    }
    .sf-widget-window.open { display: flex; }
    @keyframes sf-slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .sf-widget-header {
      background: ${color};
      color: white;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sf-widget-header-info h3 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
    .sf-widget-header-info p { font-size: 12px; opacity: 0.9; }
    .sf-widget-close {
      width: 32px;
      height: 32px;
      background: rgba(255,255,255,0.2);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: background 0.2s;
    }
    .sf-widget-close:hover { background: rgba(255,255,255,0.3); }
    .sf-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .sf-widget-message {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
    }
    .sf-widget-message.agent {
      background: #f3f4f6;
      color: #1f2937;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .sf-widget-message.customer {
      background: ${color};
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .sf-widget-message-time {
      font-size: 10px;
      opacity: 0.7;
      margin-top: 4px;
    }
    .sf-widget-welcome {
      text-align: center;
      padding: 40px 20px;
    }
    .sf-widget-welcome-icon {
      width: 64px;
      height: 64px;
      background: ${color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }
    .sf-widget-welcome-icon svg { width: 32px; height: 32px; color: white; }
    .sf-widget-welcome h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
    .sf-widget-welcome p { color: #6b7280; font-size: 14px; }
    .sf-widget-input-area {
      padding: 16px;
      border-top: 1px solid #e5e7eb;
    }
    .sf-widget-input-wrapper {
      display: flex;
      gap: 8px;
    }
    .sf-widget-input {
      flex: 1;
      padding: 12px 14px;
      border: 1px solid #d1d5db;
      border-radius: 24px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    .sf-widget-input:focus { border-color: ${color}; }
    .sf-widget-send {
      width: 44px;
      height: 44px;
      background: ${color};
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: background 0.2s;
    }
    .sf-widget-send:hover { background: ${color === '#6366f1' ? '#4f46e5' : color}; }
    .sf-widget-prechat {
      padding: 20px;
    }
    .sf-widget-prechat-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .sf-widget-prechat-input {
      padding: 12px 14px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
    }
    .sf-widget-prechat-input:focus { border-color: ${color}; }
    .sf-widget-prechat-submit {
      padding: 14px;
      background: ${color};
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .sf-widget-prechat-submit:hover { background: ${color === '#6366f1' ? '#4f46e5' : color}; }
    .sf-widget-prechat-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .sf-widget-typing {
      padding: 8px 16px;
      font-size: 12px;
      color: #6b7280;
      font-style: italic;
    }
    @media (max-width: 440px) {
      .sf-widget-window { width: calc(100vw - 32px); left: 16px !important; right: 16px !important; }
      .sf-widget-button { right: 16px; bottom: 16px; width: 52px; height: 52px; }
    }
  `;

  // Inject styles
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Load widget configuration
  async function loadConfig() {
    try {
      const res = await fetch(`/api/settings/widget/${workspaceId}`);
      if (!res.ok) throw new Error('Workspace not found');
      widgetConfig = await res.json();
      createWidget();
    } catch (err) {
      console.error('SupportForge: Failed to load widget config', err);
    }
  }

  function createWidget() {
    // Create button
    const button = document.createElement('button');
    button.className = 'sf-widget-button';
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span class="sf-widget-badge" style="display:none">0</span>
    `;
    button.onclick = toggleWidget;
    document.body.appendChild(button);

    // Create window
    const window = document.createElement('div');
    window.className = 'sf-widget-window';
    window.id = 'sf-widget-window';
    window.innerHTML = `
      <div class="sf-widget-header">
        <div class="sf-widget-header-info">
          <h3>${widgetConfig?.workspaceName || 'Support'}</h3>
          <p>We typically reply within minutes</p>
        </div>
        <button class="sf-widget-close" onclick="closeWidget()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div id="sf-widget-content"></div>
    `;
    document.body.appendChild(window);
  }

  function toggleWidget() {
    const win = document.getElementById('sf-widget-window');
    isOpen = !isOpen;
    
    if (isOpen) {
      win.classList.add('open');
      updateBadge(0);
      initWidgetChat();
    } else {
      win.classList.remove('open');
    }
  }

  window.closeWidget = function() {
    const win = document.getElementById('sf-widget-window');
    isOpen = false;
    win.classList.remove('open');
  };

  function updateBadge(count) {
    const badge = document.querySelector('.sf-widget-badge');
    if (count > 0) {
      badge.textContent = count > 9 ? '9+' : count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }

  function initWidgetChat() {
    const content = document.getElementById('sf-widget-content');
    
    if (!widgetConfig) {
      content.innerHTML = '<div class="sf-widget-messages"><p>Loading...</p></div>';
      return;
    }

    content.innerHTML = `
      <div class="sf-widget-messages" id="sf-messages">
        <div class="sf-widget-welcome">
          <div class="sf-widget-welcome-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3>${widgetConfig.welcomeMessage || 'Hi there! How can we help?'}</h3>
          <p>Start a conversation and we'll get back to you as soon as possible.</p>
        </div>
      </div>
      <div class="sf-widget-prechat" id="sf-prechat">
        <form class="sf-widget-prechat-form" onsubmit="submitPrechat(event)">
          <input type="text" class="sf-widget-prechat-input" id="sf-name" placeholder="Your name (optional)">
          <input type="email" class="sf-widget-prechat-input" id="sf-email" placeholder="Your email (optional)">
          <input type="text" class="sf-widget-prechat-input" id="sf-subject" placeholder="What's this about?">
          <button type="submit" class="sf-widget-prechat-submit">Start Chat</button>
        </form>
      </div>
      <div class="sf-widget-input-area" id="sf-input-area" style="display:none">
        <div class="sf-widget-input-wrapper">
          <input type="text" class="sf-widget-input" id="sf-message-input" placeholder="Type a message..." onkeydown="handleWidgetKeydown(event)">
          <button class="sf-widget-send" onclick="sendWidgetMessage()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Connect WebSocket
    connectWebSocket();
  }

  function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    ws.onopen = () => {
      // No auth needed for customers
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'message_update' && msg.conversationId === conversationId) {
        addMessageToWidget(msg.message);
      }
    };

    ws.onclose = () => {
      setTimeout(connectWebSocket, 3000);
    };
  }

  window.submitPrechat = async function(e) {
    e.preventDefault();
    const name = document.getElementById('sf-name').value;
    const email = document.getElementById('sf-email').value;
    const subject = document.getElementById('sf-subject').value;

    if (!subject.trim()) {
      alert('Please enter what you need help with');
      return;
    }

    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          customerName: name || 'Anonymous',
          customerEmail: email,
          subject,
          message: `Hi, I'd like to chat about: ${subject}`
        })
      });

      const data = await res.json();
      conversationId = data.conversation.id;
      customerId = data.customerId;

      // Show chat interface
      document.getElementById('sf-prechat').style.display = 'none';
      document.getElementById('sf-input-area').style.display = 'block';
      
      // Add initial message
      addMessageToWidget({
        content: `Hi${name ? ' ' + name : ''}! Thanks for reaching out. How can we help you today?`,
        sender_type: 'agent',
        created_at: new Date().toISOString()
      });

      document.getElementById('sf-message-input').focus();
    } catch (err) {
      alert('Failed to start conversation. Please try again.');
    }
  };

  window.sendWidgetMessage = async function() {
    const input = document.getElementById('sf-message-input');
    if (!input.value.trim() || !conversationId) return;

    const content = input.value.trim();
    input.value = '';

    // Add customer message immediately
    addMessageToWidget({
      content,
      sender_type: 'customer',
      created_at: new Date().toISOString()
    });

    try {
      await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  window.handleWidgetKeydown = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendWidgetMessage();
    }
  };

  function addMessageToWidget(msg) {
    const container = document.getElementById('sf-messages');
    if (!container) return;

    // Remove welcome message if present
    const welcome = container.querySelector('.sf-widget-welcome');
    if (welcome) welcome.remove();

    const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = `sf-widget-message ${msg.sender_type === 'customer' ? 'customer' : 'agent'}`;
    div.innerHTML = `
      ${escapeHtml(msg.content)}
      <div class="sf-widget-message-time">${time}</div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize
  loadConfig();
})();
