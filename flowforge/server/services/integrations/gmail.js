// Gmail Integration Handler

async function executeAction(action, data, db, userId) {
  const { type, config } = action;
  
  const connectedApp = db.prepare(
    'SELECT * FROM connected_apps WHERE user_id = ? AND app_name = "gmail"'
  ).get(userId);
  
  if (!connectedApp) {
    throw new Error('Gmail not connected. Please connect your Gmail account.');
  }
  
  const token = connectedApp.access_token;
  
  switch (type) {
    case 'send_email':
      return await sendEmail(config, data, token);
    
    case 'apply_label':
      return await applyLabel(config, data, token);
    
    case 'archive_email':
      return await archiveEmail(config, data, token);
    
    default:
      throw new Error(`Unknown Gmail action: ${type}`);
  }
}

async function sendEmail(config, data, token) {
  const { to, subject, body, cc, bcc, attachments } = config;
  
  // Build email content
  const toAddress = interpolate(to, data);
  const emailSubject = interpolate(subject, data);
  const emailBody = interpolate(body, data);
  
  // Create RFC2822 formatted email
  const email = createEmail({
    to: toAddress,
    from: 'me',
    subject: emailSubject,
    body: emailBody,
    cc: cc ? interpolate(cc, data) : undefined,
    bcc: bcc ? interpolate(bcc, data) : undefined
  });
  
  // Encode to base64url
  const encodedMessage = Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: encodedMessage })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gmail error: ${error.error?.message || response.statusText}`);
  }
  
  return await response.json();
}

async function applyLabel(config, data, token) {
  const { message_id, label_name } = config;
  
  // First, find or create the label
  const labelId = await findOrCreateLabel(label_name, token);
  
  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message_id}/modify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      addLabelIds: [labelId]
    })
  });
  
  if (!response.ok) {
    throw new Error(`Gmail error: ${response.statusText}`);
  }
  
  return await response.json();
}

async function archiveEmail(config, data, token) {
  const { message_id } = config;
  
  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message_id}/modify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      removeLabelIds: ['INBOX']
    })
  });
  
  if (!response.ok) {
    throw new Error(`Gmail error: ${response.statusText}`);
  }
  
  return await response.json();
}

async function findOrCreateLabel(labelName, token) {
  // List labels
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  const existing = data.labels?.find(l => l.name === labelName);
  
  if (existing) {
    return existing.id;
  }
  
  // Create label
  const createResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: labelName })
  });
  
  const created = await createResponse.json();
  return created.id;
}

function createEmail({ to, from, subject, body, cc, bcc }) {
  const lines = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    cc ? `Cc: ${cc}` : '',
    bcc ? `Bcc: ${bcc}` : '',
    '',
    body
  ];
  
  return lines.filter(l => l).join('\r\n');
}

function interpolate(template, data) {
  if (typeof template !== 'string') return template;
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], data) ?? '';
  });
}

module.exports = { executeAction };
