// Notion Integration Handler

async function executeAction(action, data, db, userId) {
  const { type, config } = action;
  
  const connectedApp = db.prepare(
    'SELECT * FROM connected_apps WHERE user_id = ? AND app_name = "notion"'
  ).get(userId);
  
  if (!connectedApp) {
    throw new Error('Notion not connected. Please connect your Notion account.');
  }
  
  const token = connectedApp.access_token;
  
  switch (type) {
    case 'create_page':
      return await createPage(config, data, token);
    
    case 'update_page':
      return await updatePage(config, data, token);
    
    case 'add_database_row':
      return await addDatabaseRow(config, data, token);
    
    case 'get_page':
      return await getPage(config, data, token);
    
    default:
      throw new Error(`Unknown Notion action: ${type}`);
  }
}

async function createPage(config, data, token) {
  const { parent_id, parent_type = 'page_id', properties, children } = config;
  
  const body = {
    parent: { [parent_type]: parent_id },
    properties: transformProperties(properties, data),
    children: children ? transformChildren(children, data) : undefined
  };
  
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Notion error: ${error.message || response.statusText}`);
  }
  
  return await response.json();
}

async function updatePage(config, data, token) {
  const { page_id, properties, archived = false } = config;
  
  const body = {
    properties: transformProperties(properties, data),
    archived
  };
  
  const response = await fetch(`https://api.notion.com/v1/pages/${page_id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Notion error: ${error.message || response.statusText}`);
  }
  
  return await response.json();
}

async function addDatabaseRow(config, data, token) {
  const { database_id, properties } = config;
  
  const body = {
    parent: { database_id },
    properties: transformProperties(properties, data)
  };
  
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Notion error: ${error.message || response.statusText}`);
  }
  
  return await response.json();
}

async function getPage(config, data, token) {
  const { page_id } = config;
  
  const response = await fetch(`https://api.notion.com/v1/pages/${page_id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Notion error: ${response.statusText}`);
  }
  
  return await response.json();
}

function transformProperties(properties, data) {
  const result = {};
  for (const [key, value] of Object.entries(properties)) {
    if (value.type === 'title') {
      result[key] = { title: [{ text: { content: interpolate(value.content, data) } }] };
    } else if (value.type === 'rich_text') {
      result[key] = { rich_text: [{ text: { content: interpolate(value.content, data) } }] };
    } else if (value.type === 'number') {
      result[key] = { number: parseFloat(interpolate(value.content, data)) };
    } else if (value.type === 'checkbox') {
      result[key] = { checkbox: value.content === 'true' };
    } else {
      result[key] = value;
    }
  }
  return result;
}

function transformChildren(children, data) {
  return children.map(child => ({
    type: child.type,
    [child.type]: child.content ? { content: interpolate(child.content, data) } : {}
  }));
}

function interpolate(template, data) {
  if (typeof template !== 'string') return template;
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], data) ?? '';
  });
}

module.exports = { executeAction };
