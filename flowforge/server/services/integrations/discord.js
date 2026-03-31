// Discord Integration Handler

async function executeAction(action, data, db, userId) {
  const { type, config } = action;
  
  const connectedApp = db.prepare(
    'SELECT * FROM connected_apps WHERE user_id = ? AND app_name = "discord"'
  ).get(userId);
  
  if (!connectedApp) {
    throw new Error('Discord not connected. Please connect your Discord account.');
  }
  
  const token = connectedApp.access_token;
  const botToken = connectedApp.metadata ? JSON.parse(connectedApp.metadata).bot_token : null;
  
  // Use bot token for most actions
  const authToken = botToken || token;
  
  switch (type) {
    case 'send_message':
      return await sendMessage(config, data, authToken);
    
    case 'create_channel':
      return await createChannel(config, data, authToken);
    
    case 'manage_role':
      return await manageRole(config, data, authToken);
    
    default:
      throw new Error(`Unknown Discord action: ${type}`);
  }
}

async function sendMessage(config, data, token) {
  const { channel_id, content, embeds, tts = false } = config;
  
  const body = {
    content: interpolate(content, data),
    tts
  };
  
  if (embeds) {
    body.embeds = embeds.map(embed => ({
      title: embed.title ? interpolate(embed.title, data) : undefined,
      description: embed.description ? interpolate(embed.description, data) : undefined,
      color: embed.color,
      url: embed.url ? interpolate(embed.url, data) : undefined
    }));
  }
  
  const response = await fetch(`https://discord.com/api/v10/channels/${channel_id}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Discord error: ${error.message || response.statusText}`);
  }
  
  return await response.json();
}

async function createChannel(config, data, token) {
  const { guild_id, name, type = 0, topic, permission_overwrites } = config;
  
  const body = {
    name: interpolate(name, data),
    type: type // 0 = text, 2 = voice
  };
  
  if (topic) {
    body.topic = interpolate(topic, data);
  }
  
  const response = await fetch(`https://discord.com/api/v10/guilds/${guild_id}/channels`, {
    method: 'POST',
    headers: {
      'Authorization': `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Discord error: ${error.message || response.statusText}`);
  }
  
  return await response.json();
}

async function manageRole(config, data, token) {
  const { guild_id, role_id, user_id, action } = config;
  
  // action: add, remove, or update
  if (action === 'add' || action === 'remove') {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${guild_id}/members/${user_id}/roles/${role_id}`,
      {
        method: action === 'add' ? 'PUT' : 'DELETE',
        headers: { 'Authorization': `Bot ${token}` }
      }
    );
    
    if (!response.ok && response.status !== 204) {
      throw new Error(`Discord error: ${response.statusText}`);
    }
    
    return { success: true, action };
  }
  
  throw new Error(`Unknown role action: ${action}`);
}

function interpolate(template, data) {
  if (typeof template !== 'string') return template;
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], data) ?? '';
  });
}

module.exports = { executeAction };
