// Airtable Integration Handler

async function executeAction(action, data, db, userId) {
  const { type, config } = action;
  
  // Get user's Airtable token
  const connectedApp = db.prepare(
    'SELECT * FROM connected_apps WHERE user_id = ? AND app_name = "airtable"'
  ).get(userId);
  
  if (!connectedApp) {
    throw new Error('Airtable not connected. Please connect your Airtable account.');
  }
  
  const token = connectedApp.access_token;
  
  switch (type) {
    case 'create_record':
      return await createRecord(config, data, token);
    
    case 'update_record':
      return await updateRecord(config, data, token);
    
    case 'delete_record':
      return await deleteRecord(config, data, token);
    
    case 'list_records':
      return await listRecords(config, data, token);
    
    default:
      throw new Error(`Unknown Airtable action: ${type}`);
  }
}

async function createRecord(config, data, token) {
  const { base_id, table_id, fields } = config;
  
  // Transform fields using data
  const transformedFields = {};
  for (const [key, value] of Object.entries(fields || {})) {
    transformedFields[key] = interpolate(value, data);
  }
  
  const response = await fetch(`https://api.airtable.com/v0/${base_id}/${table_id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields: transformedFields })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Airtable error: ${error.error?.message || response.statusText}`);
  }
  
  return await response.json();
}

async function updateRecord(config, data, token) {
  const { base_id, table_id, record_id, fields } = config;
  
  const transformedFields = {};
  for (const [key, value] of Object.entries(fields || {})) {
    transformedFields[key] = interpolate(value, data);
  }
  
  const response = await fetch(`https://api.airtable.com/v0/${base_id}/${table_id}/${record_id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields: transformedFields })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Airtable error: ${error.error?.message || response.statusText}`);
  }
  
  return await response.json();
}

async function deleteRecord(config, data, token) {
  const { base_id, table_id, record_id } = config;
  
  const response = await fetch(`https://api.airtable.com/v0/${base_id}/${table_id}/${record_id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Airtable error: ${response.statusText}`);
  }
  
  return await response.json();
}

async function listRecords(config, data, token) {
  const { base_id, table_id, filter_by_formula, max_records } = config;
  
  const params = new URLSearchParams();
  if (filter_by_formula) {
    params.set('filterByFormula', interpolate(filter_by_formula, data));
  }
  if (max_records) {
    params.set('maxRecords', max_records);
  }
  
  const url = `https://api.airtable.com/v0/${base_id}/${table_id}?${params.toString()}`;
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    throw new Error(`Airtable error: ${response.statusText}`);
  }
  
  return await response.json();
}

function interpolate(template, data) {
  if (typeof template !== 'string') return template;
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], data) ?? '';
  });
}

module.exports = { executeAction };
