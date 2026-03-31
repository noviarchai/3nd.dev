const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const { JWT_SECRET } = require('../middleware/auth');

let wss;
const clients = new Map(); // workspaceId -> Set of ws clients
const agentSockets = new Map(); // userId -> ws

function initWebSocket(server) {
  wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    ws.isAlive = true;
    ws.workspaceId = null;
    ws.userId = null;
    ws.userRole = null;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data);
        handleMessage(ws, msg);
      } catch (err) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      if (ws.workspaceId && clients.has(ws.workspaceId)) {
        clients.get(ws.workspaceId).delete(ws);
      }
      if (ws.userId) {
        agentSockets.delete(ws.userId);
      }
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err.message);
    });
  });

  // Heartbeat to detect dead connections
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  console.log('✅ WebSocket server initialized on /ws');
  return wss;
}

function handleMessage(ws, msg) {
  switch (msg.type) {
    case 'auth':
      handleAuth(ws, msg);
      break;
    case 'join_workspace':
      handleJoinWorkspace(ws, msg);
      break;
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong' }));
      break;
    default:
      ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
  }
}

function handleAuth(ws, msg) {
  try {
    const decoded = jwt.verify(msg.token, JWT_SECRET);
    const user = db.prepare('SELECT id, email, name, role, workspace_id FROM users WHERE id = ?').get(decoded.userId);
    
    if (!user) {
      ws.send(JSON.stringify({ type: 'auth_error', message: 'User not found' }));
      return;
    }

    ws.userId = user.id;
    ws.workspaceId = user.workspace_id;
    ws.userRole = user.role;
    ws.userName = user.name;

    // Track agent socket
    if (user.role === 'admin' || user.role === 'agent') {
      agentSockets.set(user.id, ws);
    }

    // Add to workspace clients
    if (!clients.has(user.workspace_id)) {
      clients.set(user.workspace_id, new Set());
    }
    clients.get(user.workspace_id).add(ws);

    ws.send(JSON.stringify({ type: 'auth_success', user: { id: user.id, name: user.name, role: user.role } }));
    
    // Send pending conversation updates
    sendPendingUpdates(ws, user.workspace_id);
  } catch (err) {
    ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }));
  }
}

function handleJoinWorkspace(ws, msg) {
  if (!ws.userId) {
    ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
    return;
  }

  ws.workspaceId = msg.workspaceId;
  
  if (!clients.has(msg.workspaceId)) {
    clients.set(msg.workspaceId, new Set());
  }
  clients.get(msg.workspaceId).add(ws);

  ws.send(JSON.stringify({ type: 'workspace_joined', workspaceId: msg.workspaceId }));
}

function sendPendingUpdates(ws, workspaceId) {
  // Send recent conversations count
  const openCount = db.prepare(
    'SELECT COUNT(*) as count FROM conversations WHERE workspace_id = ? AND status = ?'
  ).get(workspaceId, 'open');
  
  ws.send(JSON.stringify({ 
    type: 'dashboard_update', 
    openConversations: openCount.count 
  }));
}

function broadcastToWorkspace(workspaceId, message) {
  if (!clients.has(workspaceId)) return;
  
  const messageStr = JSON.stringify(message);
  clients.get(workspaceId).forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

function notifyAgents(workspaceId, conversationId, message) {
  broadcastToWorkspace(workspaceId, {
    type: 'new_message',
    conversationId,
    message
  });
}

function notifyCustomer(conversationId, message) {
  // This notifies ALL clients watching this conversation (customer + agents)
  const conversation = db.prepare('SELECT workspace_id FROM conversations WHERE id = ?').get(conversationId);
  if (conversation) {
    broadcastToWorkspace(conversation.workspace_id, {
      type: 'message_update',
      conversationId,
      message
    });
  }
}

function broadcastConversationUpdate(workspaceId, conversation) {
  broadcastToWorkspace(workspaceId, {
    type: 'conversation_update',
    conversation
  });
}

function getConnectedAgents(workspaceId) {
  const agents = [];
  clients.get(workspaceId)?.forEach((client) => {
    if (client.userRole === 'agent' || client.userRole === 'admin') {
      agents.push({ id: client.userId, name: client.userName, role: client.userRole });
    }
  });
  return agents;
}

module.exports = { initWebSocket, broadcastToWorkspace, notifyAgents, notifyCustomer, broadcastConversationUpdate, getConnectedAgents };
