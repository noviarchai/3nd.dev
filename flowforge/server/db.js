const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../data/flowforge.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

function initialize() {
  const db = getDb();
  
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      plan_tier TEXT DEFAULT 'free',
      executions_used INTEGER DEFAULT 0,
      exec_limit INTEGER DEFAULT 500,
      is_admin INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Connected apps table
  db.exec(`
    CREATE TABLE IF NOT EXISTS connected_apps (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      app_name TEXT NOT NULL,
      access_token TEXT,
      refresh_token TEXT,
      token_expires_at TEXT,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Workflows table
  db.exec(`
    CREATE TABLE IF NOT EXISTS workflows (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      trigger_app TEXT NOT NULL,
      trigger_type TEXT NOT NULL,
      trigger_config TEXT,
      actions TEXT,
      is_active INTEGER DEFAULT 1,
      is_test INTEGER DEFAULT 0,
      total_runs INTEGER DEFAULT 0,
      last_run_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Execution logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS execution_logs (
      id TEXT PRIMARY KEY,
      workflow_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      trigger_data TEXT,
      action_results TEXT,
      error_message TEXT,
      execution_time_ms INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (workflow_id) REFERENCES workflows(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Webhook endpoints table
  db.exec(`
    CREATE TABLE IF NOT EXISTS webhook_endpoints (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      workflow_id TEXT,
      endpoint_path TEXT UNIQUE NOT NULL,
      secret_key TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (workflow_id) REFERENCES workflows(id)
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_workflows_user ON workflows(user_id);
    CREATE INDEX IF NOT EXISTS idx_executions_workflow ON execution_logs(workflow_id);
    CREATE INDEX IF NOT EXISTS idx_executions_user ON execution_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_connected_apps_user ON connected_apps(user_id);
    CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_path ON webhook_endpoints(endpoint_path);
  `);

  console.log('Database initialized successfully');
}

module.exports = { getDb, initialize };
