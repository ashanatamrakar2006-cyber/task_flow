function TaskCard({ task, allColumns, onEditClick, onDelete, onMove }) {
    return (
      <div className="task-card">
        <div className="task-header">
          <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
        </div>
        <h4>{task.title}</h4>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-actions">
          <select
            value={task.column_id}
            onChange={(e) => onMove(task.id, Number(e.target.value))}
          >
            {allColumns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>
          <button onClick={() => onEditClick(task)}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </div>
    );
  }
  
  export default TaskCard;