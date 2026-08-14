const express = require('express');
const db = require('../db/db');

const router = express.Router();

// POST /api/tasks - create a new task
router.post('/', (req, res) => {
  const { column_id, title, description, priority } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (!column_id) {
    return res.status(400).json({ error: 'column_id is required' });
  }

  const insert = db.prepare(
    'INSERT INTO tasks (column_id, title, description, priority) VALUES (?, ?, ?, ?)'
  );
  const result = insert.run(column_id, title.trim(), description || null, priority || 'Medium');

  const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - edit an existing task
router.put('/:id', (req, res) => {
  const { title, description, priority } = req.body;
  const taskId = req.params.id;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }

  db.prepare('UPDATE tasks SET title = ?, description = ?, priority = ? WHERE id = ?').run(
    title.trim(),
    description || null,
    priority || existing.priority,
    taskId
  );

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  res.json(updated);
});

// PATCH /api/tasks/:id/move - move task to another column
router.patch('/:id/move', (req, res) => {
  const { column_id } = req.body;
  const taskId = req.params.id;

  if (!column_id) {
    return res.status(400).json({ error: 'column_id is required' });
  }

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }

  db.prepare('UPDATE tasks SET column_id = ? WHERE id = ?').run(column_id, taskId);

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  res.json(updated);
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const taskId = req.params.id;

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
  res.json({ message: 'Task deleted' });
});

// GET /api/tasks/priority/:level - tasks by priority, newest first (required query #2)
router.get('/priority/:level', (req, res) => {
  const level = req.params.level;

  const tasks = db
    .prepare('SELECT * FROM tasks WHERE priority = ? ORDER BY created_at DESC')
    .all(level);

  res.json(tasks);
});

module.exports = router;