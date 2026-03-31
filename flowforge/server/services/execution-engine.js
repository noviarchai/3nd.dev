const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db');

// Integration handlers
const integrations = {
  airtable: require('./integrations/airtable'),
  notion: require('./integrations/notion'),
  slack: require('./integrations/slack'),
  gmail: require('./integrations/gmail'),
  twitter: require('./integrations/twitter'),
  discord: require('./integrations/discord'),
  webhook: require('./integrations/webhook')
};

async function executeWorkflow(workflow, triggerData, isTest = false) {
  const startTime = Date.now();
  const executionId = uuidv4();
  const db = getDb();
  
  // Validate execution limit (skip for test mode)
  if (!isTest) {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(workflow.user_id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.executions_used >= user.exec_limit) {
      // Record failed execution
      db.prepare(`
        INSERT INTO execution_logs (id, workflow_id, user_id, status, error_message, execution_time_ms)
        VALUES (?, ?, ?, 'error', ?, ?)
      `).run(executionId, workflow.id, workflow.user_id, 'Execution limit exceeded', Date.now() - startTime);
      
      throw new Error('Execution limit exceeded. Please upgrade your plan.');
    }
  }
  
  // Record pending execution
  db.prepare(`
    INSERT INTO execution_logs (id, workflow_id, user_id, status, trigger_data)
    VALUES (?, ?, ?, 'pending', ?)
  `).run(executionId, workflow.id, workflow.user_id, JSON.stringify(triggerData));
  
  const actionResults = [];
  
  try {
    // Parse workflow config
    const triggerConfig = typeof workflow.trigger_config === 'string' 
      ? JSON.parse(workflow.trigger_config) 
      : workflow.trigger_config;
    
    const actions = typeof workflow.actions === 'string'
      ? JSON.parse(workflow.actions)
      : workflow.actions;
    
    // Process trigger data (transform if needed)
    let processedData = triggerData;
    if (triggerConfig.transform) {
      processedData = transformData(triggerData, triggerConfig.transform);
    }
    
    // Execute actions sequentially
    for (const action of actions) {
      const integration = integrations[action.app];
      
      if (!integration) {
        actionResults.push({
          action: action.type,
          status: 'error',
          error: `Unknown app: ${action.app}`
        });
        continue;
      }
      
      try {
        const result = await integration.executeAction(
          action,
          processedData,
          db,
          workflow.user_id
        );
        
        actionResults.push({
          action: action.type,
          status: 'success',
          result
        });
        
        // Store result for next action (can reference previous results)
        processedData = { ...processedData, [`${action.app}_${action.type}`]: result };
        
      } catch (actionError) {
        actionResults.push({
          action: action.type,
          status: 'error',
          error: actionError.message
        });
        
        // Retry logic (3 attempts)
        if (action.retry !== false) {
          let retries = 3;
          while (retries > 0) {
            retries--;
            await sleep(1000 * (4 - retries)); // Exponential backoff
            try {
              const result = await integration.executeAction(
                action,
                processedData,
                db,
                workflow.user_id
              );
              actionResults[actionResults.length - 1] = {
                action: action.type,
                status: 'success',
                result,
                retries_used: 4 - retries
              };
              processedData = { ...processedData, [`${action.app}_${action.type}`]: result };
              break;
            } catch (retryError) {
              if (retries === 0) {
                actionResults[actionResults.length - 1].error = retryError.message;
              }
            }
          }
        }
      }
    }
    
    const hasErrors = actionResults.some(r => r.status === 'error');
    
    // Update execution log
    db.prepare(`
      UPDATE execution_logs SET 
        status = ?,
        action_results = ?,
        error_message = ?,
        execution_time_ms = ?
      WHERE id = ?
    `).run(
      hasErrors ? 'partial' : 'success',
      JSON.stringify(actionResults),
      hasErrors ? 'Some actions failed' : null,
      Date.now() - startTime,
      executionId
    );
    
    // Update workflow stats
    db.prepare(`
      UPDATE workflows SET 
        total_runs = total_runs + 1,
        last_run_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(workflow.id);
    
    // Increment user execution count (not for test mode)
    if (!isTest) {
      db.prepare(`
        UPDATE users SET executions_used = executions_used + 1 WHERE id = ?
      `).run(workflow.user_id);
    }
    
    return {
      execution_id: executionId,
      status: hasErrors ? 'partial' : 'success',
      action_results: actionResults,
      execution_time_ms: Date.now() - startTime
    };
    
  } catch (error) {
    // Update execution log with error
    db.prepare(`
      UPDATE execution_logs SET 
        status = 'error',
        error_message = ?,
        execution_time_ms = ?
      WHERE id = ?
    `).run(error.message, Date.now() - startTime, executionId);
    
    return {
      execution_id: executionId,
      status: 'error',
      error: error.message,
      action_results: actionResults,
      execution_time_ms: Date.now() - startTime
    };
  }
}

function transformData(data, transform) {
  // Simple data transformation
  // In production, this would be a more sophisticated mapping
  const result = {};
  
  for (const [key, mapping] of Object.entries(transform)) {
    if (typeof mapping === 'string') {
      result[key] = getNestedValue(data, mapping);
    } else if (mapping.type === 'static') {
      result[key] = mapping.value;
    } else if (mapping.type === 'template') {
      result[key] = interpolate(mapping.value, data);
    }
  }
  
  return result;
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function interpolate(template, data) {
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    return getNestedValue(data, path) ?? '';
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { executeWorkflow, transformData };
