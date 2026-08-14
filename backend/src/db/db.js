const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Database file will be created at backend/taskflow.db
const dbPath = path.join(__dirname, '../../taskflow.db');
const db = new Database(dbPath);

// Enable foreign key constraints (SQLite has them off by default)
db.pragma('foreign_keys = ON');

// Load and run schema.sql to create tables if they don't exist
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

module.exports = db;