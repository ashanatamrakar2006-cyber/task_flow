import { useState } from 'react';
import Column from './Column';
import TaskForm from './TaskForm';
import { createTask, updateTask, deleteTask, moveTask } from '../api/client';

function Board({ board, onRefresh }) {
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [error, setError] = useState(null);
  const [creatingInColumn, setCreatingInColumn] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const handleCreate = async (columnId, taskData) => {
    try {
      setError(null);
      await createTask({ ...taskData, column_id: columnId });
      setCreatingInColumn(null);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (taskId, taskData) => {
    try {
      setError(null);
      await updateTask(taskId, taskData);
      setEditingTask(null);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      setError(null);
      await deleteTask(taskId);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMove = async (taskId, newColumnId) => {
    try {
      setError(null);
      await moveTask(taskId, newColumnId);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="toolbar">
        <label>
          Filter by priority:{' '}
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
      </div>

      {error && <div className="status-message error">{error}</div>}

      <div className="board">
        {board.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            allColumns={board.columns}
            priorityFilter={priorityFilter}
            onCreateClick={() => setCreatingInColumn(column.id)}
            onEditClick={(task) => setEditingTask(task)}
            onDelete={handleDelete}
            onMove={handleMove}
          />
        ))}
      </div>

      {creatingInColumn && (
        <TaskForm
          onSubmit={(data) => handleCreate(creatingInColumn, data)}
          onCancel={() => setCreatingInColumn(null)}
        />
      )}

      {editingTask && (
        <TaskForm
          initialData={editingTask}
          onSubmit={(data) => handleEdit(editingTask.id, data)}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}

export default Board;