// Slack Integration Handler

async function executeAction(action, data, db, userId) {
  const { type, config } = action;
  
  const connectedApp = db.prepare(
    'SELECT * FROM connected_apps WHERE user_id = ? AND app_name = "slack"'
  ).get(userId);
  
  if (!connectedApp) {
    throw new Error('Slack not connected. Please connect your Slack account.');
  }
  
  const token = connectedApp.access_token;
  
  switch (type) {
    case 'send_message':
      return await sendMessage(config, data, token);
    
    case 'create_channel':
      return await createChannel(config, data, token);
    
    case 'add_reaction':
      return await addReaction(config, data, token);
    
    case 'get_channel_info':
      return await getChannelInfo(config, data, token);
    
    default:
      throw new Error(`Unknown Slack action: ${type}`);
  }
}

async function sendMessage(config, data, token) {
  const { channel, text, blocks } = config;
  
  const body = {
    channel: interpolate(channel, data),
    text: interpolate(text || '', data),
    blocks: blocks ? blocks.map(b => ({
      type: b.type || 'section',
      text: b.text ? { type: 'mrkdwn', text: interpolate(b.text, data) } : undefined
    })).filter(b => b.text) : undefined
  };
  
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  const result = await response.json();
  
  if (!result.ok) {
    throw new Error(`Slack error: ${result.error}`);
  }
  
  return result;
}

async function createChannel(config, data, token) {
  const { name, is_private = false } = config;
  
  const response = await fetch('https://slack.com/api/conversations.create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: interpolate(name, data),
      is_private
    })
  });
  
  const result = await response.json();
  
  if (!result.ok) {
    throw new Error(`Slack error: ${result.error}`);
  }
  
  return result;
}

async function addReaction(config, data, token) {
  const { channel, timestamp, emoji } = config;
  
  const response = await fetch('https://slack.com/api/reactions.add', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      channel: interpolate(channel, data),
      timestamp: interpolate(timestamp, data),
      name: interpolate(emoji, data)
    })
  });
  
  const result = await response.json();
  
  if (!result.ok) {
    throw new Error(`Slack error: ${result.error}`);
  }
  
  return result;
}

async function getChannelInfo(config, data, token) {
  const { channel } = config;
  
  const response = await fetch(`https://slack.com/api/conversations.info?channel=${encodeURIComponent(channel)}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const result = await response.json();
  
  if (!result.ok) {
    throw new Error(`Slack error: ${result.error}`);
  }
  
  return result;
}

function interpolate(template, data) {
  if (typeof template !== 'string') return template;
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], data) ?? '';
  });
}

module.exports = { executeAction };
