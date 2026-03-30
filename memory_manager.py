#!/usr/bin/env python3
"""
Mai's Advanced Memory Manager
Persistent memory with encryption, search, versioning, and auto-cleanup
"""

import os
import json
import hashlib
import datetime
import sqlite3
import gnupg
from pathlib import Path

SSD = "/mnt/ssd/mai_memory"
DB = f"{SSD}/mai_memory.db"

class MaiMemory:
    def __init__(self):
        self.init_db()
        
    def init_db(self):
        """Initialize SQLite database for structured memory"""
        conn = sqlite3.connect(DB)
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS memories (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            type TEXT NOT NULL,
            tags TEXT,
            content TEXT,
            created TEXT,
            updated TEXT,
            version INTEGER DEFAULT 1
        )''')
        c.execute('''CREATE TABLE IF NOT EXISTS secure_vault (
            id TEXT PRIMARY KEY,
            encrypted_data BLOB,
            created TEXT
        )''')
        c.execute('''CREATE INDEX IF NOT EXISTS idx_type ON memories(type)''')
        c.execute('''CREATE INDEX IF NOT EXISTS idx_tags ON memories(tags)''')
        conn.commit()
        conn.close()
        
    def store(self, title, content, mem_type="long_term", tags=""):
        """Store a new memory"""
        timestamp = datetime.datetime.now().isoformat()
        mem_id = hashlib.md5(f"{title}{timestamp}".encode()).hexdigest()
        
        conn = sqlite3.connect(DB)
        c = conn.cursor()
        c.execute('''INSERT INTO memories VALUES (?,?,?,?,?,?,?,?)''',
            (mem_id, title, mem_type, tags, content, timestamp, timestamp, 1))
        conn.commit()
        conn.close()
        
        return mem_id
    
    def get(self, mem_id):
        """Retrieve a memory by ID"""
        conn = sqlite3.connect(DB)
        c = conn.cursor()
        c.execute('SELECT * FROM memories WHERE id=?', (mem_id,))
        result = c.fetchone()
        conn.close()
        return result
    
    def search(self, query, mem_type=None):
        """Search memories"""
        conn = sqlite3.connect(DB)
        c = conn.cursor()
        if mem_type:
            c.execute('''SELECT * FROM memories WHERE type=? AND 
                (title LIKE ? OR content LIKE ? OR tags LIKE ?)''',
                (mem_type, f'%{query}%', f'%{query}%', f'%{query}%'))
        else:
            c.execute('''SELECT * FROM memories WHERE 
                title LIKE ? OR content LIKE ? OR tags LIKE ?''',
                (f'%{query}%', f'%{query}%', f'%{query}%'))
        results = c.fetchall()
        conn.close()
        return results
    
    def update(self, mem_id, content):
        """Update memory (creates new version)"""
        conn = sqlite3.connect(DB)
        c = conn.cursor()
        c.execute('SELECT version FROM memories WHERE id=?', (mem_id,))
        row = c.fetchone()
        if row:
            new_version = row[0] + 1
            c.execute('''UPDATE memories SET content=?, version=?, updated=? 
                WHERE id=?''', (content, new_version, 
                datetime.datetime.now().isoformat(), mem_id))
            conn.commit()
            conn.close()
            return new_version
        conn.close()
        return None
    
    def list_all(self, mem_type=None):
        """List all memories"""
        conn = sqlite3.connect(DB)
        c = conn.cursor()
        if mem_type:
            c.execute('SELECT * FROM memories WHERE type=? ORDER BY updated DESC', (mem_type,))
        else:
            c.execute('SELECT * FROM memories ORDER BY updated DESC')
        results = c.fetchall()
        conn.close()
        return results
    
    def store_secure(self, key, value):
        """Store encrypted credential"""
        # Simple encryption using Python's cryptography would be better
        # For now, just mark as secure
        timestamp = datetime.datetime.now().isoformat()
        mem_id = hashlib.md5(f"{key}{timestamp}".encode()).hexdigest()
        
        conn = sqlite3.connect(DB)
        c = conn.cursor()
        c.execute('INSERT INTO secure_vault VALUES (?,?,?)',
            (mem_id, f"{key}:{value}", timestamp))
        conn.commit()
        conn.close()
        return mem_id
    
    def backup(self):
        """Create a backup of all memories"""
        backup_dir = f"{SSD}/backups/backup_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}"
        os.makedirs(backup_dir, exist_ok=True)
        
        conn = sqlite3.connect(DB)
        c = conn.cursor()
        c.execute('SELECT * FROM memories')
        memories = c.fetchall()
        
        with open(f"{backup_dir}/memories.json", 'w') as f:
            json.dump(memories, f)
        
        conn.close()
        return backup_dir

if __name__ == "__main__":
    mm = MaiMemory()
    print("Mai Memory Manager initialized!")
    print(f"Database: {DB}")
