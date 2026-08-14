const express = require('express');
const db = require('../db/db');

const router = express.Router();

// GET /api/boards/:id - get a board with its columns and tasks
router.get('/:id', (req, res) => {
  const boardId = req.params.id;

  const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(boardId);

  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  const columns = db
    .prepare('SELECT * FROM columns WHERE board_id = ? ORDER BY position')
    .all(boardId);

  const columnsWithTasks = columns.map((column) => {
    const tasks = db
      .prepare('SELECT * FROM tasks WHERE column_id = ? ORDER BY created_at DESC')
      .all(column.id);
    return { ...column, tasks };
  });

  res.json({ ...board, columns: columnsWithTasks });
});

// GET /api/boards/:id/task-counts - count of tasks per column (required query #1)
router.get('/:id/task-counts', (req, res) => {
  const boardId = req.params.id;

  const counts = db
    .prepare(
      `SELECT columns.id AS column_id, columns.name AS column_name, COUNT(tasks.id) AS task_count
       FROM columns
       LEFT JOIN tasks ON tasks.column_id = columns.id
       WHERE columns.board_id = ?
       GROUP BY columns.id
       ORDER BY columns.position`
    )
    .all(boardId);

  res.json(counts);
});

// POST /api/boards - create a new board with default columns
router.post('/', (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Board name is required' });
  }

  const insertBoard = db.prepare('INSERT INTO boards (name) VALUES (?)');
  const result = insertBoard.run(name.trim());
  const boardId = result.lastInsertRowid;

  const defaultColumns = ['To Do', 'In Progress', 'Done'];
  const insertColumn = db.prepare('INSERT INTO columns (board_id, name, position) VALUES (?, ?, ?)');
  defaultColumns.forEach((colName, index) => {
    insertColumn.run(boardId, colName, index);
  });

  const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(boardId);
  res.status(201).json(board);
});

module.exports = router;