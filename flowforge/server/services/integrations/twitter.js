// Twitter/X Integration Handler

async function executeAction(action, data, db, userId) {
  const { type, config } = action;
  
  const connectedApp = db.prepare(
    'SELECT * FROM connected_apps WHERE user_id = ? AND app_name = "twitter"'
  ).get(userId);
  
  if (!connectedApp) {
    throw new Error('Twitter not connected. Please connect your Twitter account.');
  }
  
  const token = connectedApp.access_token;
  
  switch (type) {
    case 'post_tweet':
      return await postTweet(config, data, token);
    
    case 'send_dm':
      return await sendDM(config, data, token);
    
    case 'retweet':
      return await retweet(config, data, token);
    
    case 'like':
      return await like(config, data, token);
    
    default:
      throw new Error(`Unknown Twitter action: ${type}`);
  }
}

async function postTweet(config, data, token) {
  const { text, media_ids, reply_to } = config;
  
  const body = {
    text: interpolate(text, data)
  };
  
  if (media_ids) {
    body.media = { media_ids: [media_ids] };
  }
  
  if (reply_to) {
    body.reply = { in_reply_to_tweet_id: interpolate(reply_to, data) };
  }
  
  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Twitter error: ${error.detail || response.statusText}`);
  }
  
  return await response.json();
}

async function sendDM(config, data, token) {
  const { recipient_id, text } = config;
  
  // Note: DM sending requires special permissions and different endpoint
  const response = await fetch('https://api.twitter.com/2/dm_messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipient_id: interpolate(recipient_id, data),
      text: interpolate(text, data)
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Twitter error: ${error.detail || response.statusText}`);
  }
  
  return await response.json();
}

async function retweet(config, data, token) {
  const { tweet_id, user_id } = config;
  
  const targetUserId = user_id || 'me';
  const targetTweetId = interpolate(tweet_id, data);
  
  const response = await fetch(`https://api.twitter.com/2/users/${targetUserId}/retweets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tweet_id: targetTweetId
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Twitter error: ${error.detail || response.statusText}`);
  }
  
  return await response.json();
}

async function like(config, data, token) {
  const { tweet_id, user_id } = config;
  
  const targetUserId = user_id || 'me';
  const targetTweetId = interpolate(tweet_id, data);
  
  const response = await fetch(`https://api.twitter.com/2/users/${targetUserId}/likes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tweet_id: targetTweetId
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Twitter error: ${error.detail || response.statusText}`);
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
