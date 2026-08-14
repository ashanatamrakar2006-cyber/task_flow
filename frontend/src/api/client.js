const BASE_URL = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Something went wrong');
  }
  return res.json();
}

export async function getBoard(boardId) {
  const res = await fetch(`${BASE_URL}/boards/${boardId}`);
  return handleResponse(res);
}

export async function getTaskCounts(boardId) {
  const res = await fetch(`${BASE_URL}/boards/${boardId}/task-counts`);
  return handleResponse(res);
}

export async function createTask(task) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return handleResponse(res);
}

export async function updateTask(taskId, task) {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return handleResponse(res);
}

export async function moveTask(taskId, columnId) {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/move`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ column_id: columnId }),
  });
  return handleResponse(res);
}

export async function deleteTask(taskId) {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}