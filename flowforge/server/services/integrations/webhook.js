// Webhook/HTTP Integration Handler

async function executeAction(action, data, db, userId) {
  const { type, config } = action;
  
  if (type !== 'http_request') {
    throw new Error(`Unknown webhook action: ${type}`);
  }
  
  const { url, method = 'GET', headers, body, params } = config;
  
  // Build URL with query params
  let fullUrl = interpolate(url, data);
  
  if (params) {
    const urlObj = new URL(fullUrl);
    for (const [key, value] of Object.entries(params)) {
      urlObj.searchParams.set(interpolate(key, data), interpolate(value, data));
    }
    fullUrl = urlObj.toString();
  }
  
  // Build headers
  const requestHeaders = {
    'Content-Type': 'application/json'
  };
  
  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      requestHeaders[key] = interpolate(value, data);
    }
  }
  
  // Build body
  let requestBody;
  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    requestBody = JSON.stringify(transformBody(body, data));
  }
  
  const response = await fetch(fullUrl, {
    method,
    headers: requestHeaders,
    body: requestBody
  });
  
  // Parse response
  const contentType = response.headers.get('content-type');
  let result;
  
  if (contentType && contentType.includes('application/json')) {
    result = await response.json();
  } else {
    result = await response.text();
  }
  
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status} - ${typeof result === 'object' ? JSON.stringify(result) : result}`);
  }
  
  return {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: result
  };
}

function transformBody(body, data) {
  if (typeof body === 'string') {
    return JSON.parse(interpolate(body, data));
  }
  
  if (typeof body === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(body)) {
      result[key] = interpolate(value, data);
    }
    return result;
  }
  
  return body;
}

function interpolate(template, data) {
  if (typeof template !== 'string') return template;
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], data) ?? '';
  });
}

module.exports = { executeAction };
