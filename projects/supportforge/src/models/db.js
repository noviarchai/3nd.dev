const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../../data/supportforge.db');
let db = null;

// Initialize database
async function initDb() {
  const SQL = await initSqlJs();
  
  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create schema
  db.run(`
    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      stripe_price_id TEXT,
      subscription_status TEXT DEFAULT 'active',
      plan TEXT DEFAULT 'free_trial',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'agent',
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      email TEXT,
      name TEXT,
      external_id TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      customer_id TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      priority TEXT DEFAULT 'normal',
      assigned_to TEXT,
      subject TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      closed_at DATETIME,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
      FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender_id TEXT,
      sender_type TEXT NOT NULL,
      content TEXT NOT NULL,
      message_type TEXT DEFAULT 'text',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS canned_responses (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      user_id TEXT,
      shortcut TEXT NOT NULL,
      content TEXT NOT NULL,
      title TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      workspace_id TEXT UNIQUE NOT NULL,
      widget_color TEXT DEFAULT '#6366f1',
      widget_position TEXT DEFAULT 'right',
      welcome_message TEXT DEFAULT 'Hi there! How can we help you today?',
      business_hours TEXT,
      timezone TEXT DEFAULT 'America/Edmonton',
      email_integration_enabled INTEGER DEFAULT 0,
      chatbot_enabled INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS invitations (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      email TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'agent',
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
    )
  `);

  // Create indexes
  db.run(`CREATE INDEX IF NOT EXISTS idx_conversations_workspace ON conversations(workspace_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_conversations_customer ON conversations(customer_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_workspace ON users(workspace_id)`);

  // Seed default admin workspace if none exists
  const result = db.exec("SELECT COUNT(*) as count FROM workspaces");
  if (result.length === 0 || result[0].values[0][0] === 0) {
    const adminWorkspaceId = uuidv4();
    const adminUserId = uuidv4();
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const now = new Date().toISOString();
    
    db.run(`
      INSERT INTO workspaces (id, name, slug, plan, subscription_status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [adminWorkspaceId, 'SupportForge Demo', 'demo', 'trial', 'active', now, now]);
    
    db.run(`
      INSERT INTO users (id, workspace_id, email, password_hash, name, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [adminUserId, adminWorkspaceId, 'admin@supportforge.demo', hashedPassword, 'Admin User', 'admin', now, now]);
    
    db.run(`
      INSERT INTO settings (id, workspace_id, welcome_message, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `, [uuidv4(), adminWorkspaceId, '👋 Welcome to SupportForge! How can we help you today?', now, now]);
    
    console.log('✅ Default admin workspace created: admin@supportforge.demo / admin123');
    saveDb();
  }
  
  return db;
}

function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// Database wrapper with better-sqlite3-like API
function prepare(sql) {
  return {
    run: (...params) => {
      db.run(sql, params);
      saveDb();
      return { changes: db.getRowsModified() };
    },
    get: (...params) => {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        return row;
      }
      stmt.free();
      return undefined;
    },
    all: (...params) => {
      const results = [];
      const stmt = db.prepare(sql);
      stmt.bind(params);
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    }
  };
}

// For backward compatibility
const dbWrapper = {
  prepare: (sql) => prepare(sql),
  exec: (sql) => { db.run(sql); saveDb(); }
};

module.exports = dbWrapper;
module.exports.initDb = initDb;
module.exports.saveDb = saveDb;
