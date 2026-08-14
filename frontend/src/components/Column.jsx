import TaskCard from './TaskCard';

function Column({ column, allColumns, priorityFilter, onCreateClick, onEditClick, onDelete, onMove }) {
  const filteredTasks =
    priorityFilter === 'All'
      ? column.tasks
      : column.tasks.filter((task) => task.priority === priorityFilter);

  return (
    <div className="column">
      <div className="column-header">
        <h3>{column.name}</h3>
        <span className="task-count">{filteredTasks.length}</span>
      </div>

      <button className="add-task-btn" onClick={onCreateClick}>
        + Add Task
      </button>

      <div className="task-list">
        {filteredTasks.length === 0 && <p className="empty-message">No tasks</p>}
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            allColumns={allColumns}
            onEditClick={onEditClick}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
      </div>
    </div>
  );
}

export default Column;