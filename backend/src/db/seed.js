const db = require('./db');

// Clear existing data (so re-running seed doesn't duplicate)
db.exec('DELETE FROM tasks');
db.exec('DELETE FROM columns');
db.exec('DELETE FROM boards');

// Insert a board
const insertBoard = db.prepare('INSERT INTO boards (name) VALUES (?)');
const boardResult = insertBoard.run('My First Board');
const boardId = boardResult.lastInsertRowid;

// Insert columns
const insertColumn = db.prepare('INSERT INTO columns (board_id, name, position) VALUES (?, ?, ?)');
const todoResult = insertColumn.run(boardId, 'To Do', 0);
const inProgressResult = insertColumn.run(boardId, 'In Progress', 1);
const doneResult = insertColumn.run(boardId, 'Done', 2);

const todoId = todoResult.lastInsertRowid;
const inProgressId = inProgressResult.lastInsertRowid;
const doneId = doneResult.lastInsertRowid;

// Insert sample tasks
const insertTask = db.prepare(
  'INSERT INTO tasks (column_id, title, description, priority) VALUES (?, ?, ?, ?)'
);

insertTask.run(todoId, 'Set up project repo', 'Initialize git and folder structure', 'Medium');
insertTask.run(todoId, 'Design database schema', null, 'High');
insertTask.run(inProgressId, 'Build task API', 'CRUD endpoints for tasks', 'High');
insertTask.run(doneId, 'Research tech stack', null, 'Low');

console.log('Seed data inserted successfully!');