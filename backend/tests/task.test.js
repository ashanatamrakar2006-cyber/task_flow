const db = require('../src/db/db');

beforeEach(() => {
  db.exec('DELETE FROM tasks');
  db.exec('DELETE FROM columns');
  db.exec('DELETE FROM boards');

  const board = db.prepare('INSERT INTO boards (name) VALUES (?)').run('Test Board');
  const boardId = board.lastInsertRowid;

  const col1 = db.prepare('INSERT INTO columns (board_id, name, position) VALUES (?, ?, ?)').run(boardId, 'To Do', 0);
  const col2 = db.prepare('INSERT INTO columns (board_id, name, position) VALUES (?, ?, ?)').run(boardId, 'Done', 1);

  global.testColumnId1 = col1.lastInsertRowid;
  global.testColumnId2 = col2.lastInsertRowid;
});

test('creating a task with no title fails', () => {
  const insert = db.prepare('INSERT INTO tasks (column_id, title, priority) VALUES (?, ?, ?)');
  expect(() => {
    insert.run(global.testColumnId1, null, 'Medium');
  }).toThrow();
});

test('moving a task updates its column', () => {
  const insert = db.prepare('INSERT INTO tasks (column_id, title, priority) VALUES (?, ?, ?)');
  const result = insert.run(global.testColumnId1, 'Sample task', 'Medium');
  const taskId = result.lastInsertRowid;

  db.prepare('UPDATE tasks SET column_id = ? WHERE id = ?').run(global.testColumnId2, taskId);

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  expect(updated.column_id).toBe(global.testColumnId2);
});

test('task counts per column query returns correct counts', () => {
  const insert = db.prepare('INSERT INTO tasks (column_id, title, priority) VALUES (?, ?, ?)');
  insert.run(global.testColumnId1, 'Task 1', 'Medium');
  insert.run(global.testColumnId1, 'Task 2', 'High');
  insert.run(global.testColumnId2, 'Task 3', 'Low');

  const counts = db
    .prepare(
      `SELECT column_id, COUNT(*) as task_count FROM tasks GROUP BY column_id`
    )
    .all();

  const col1Count = counts.find((c) => c.column_id === global.testColumnId1);
  const col2Count = counts.find((c) => c.column_id === global.testColumnId2);

  expect(col1Count.task_count).toBe(2);
  expect(col2Count.task_count).toBe(1);
});