# TaskFlow

A simple task board app (Trello-lite) — Board → Columns → Tasks, built with React (frontend) and Node.js/Express + SQLite (backend).

## Tech stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** SQLite (`better-sqlite3`)
- **Testing:** Jest

## Setup instructions (fresh clone)

### 1. Clone the repo
```bash
git clone https://github.com/ashanatamrakar2006-cyber/task_flow.git
cd task_flow
```

### 2. Backend setup
```bash
cd backend
npm install
npm run seed      # creates and seeds the SQLite database
npm run dev        # starts the backend on http://localhost:4000
```

### 3. Frontend setup (in a new terminal)
```bash
cd frontend
npm install
npm run dev        # starts the frontend on http://localhost:5173
```

### 4. Open the app
Visit `http://localhost:5173` in your browser.

## Running tests

```bash
cd backend
npm test
```

Covers:
- Creating a task with no title fails (DB constraint)
- Moving a task updates its column
- The "tasks per column" query returns correct counts for known seed data

## Database schema

See [`backend/src/db/schema.sql`](backend/src/db/schema.sql) for the full schema. Summary:

- **boards** — `id` (PK), `name`
- **columns** — `id` (PK), `board_id` (FK → boards), `name`, `position`
- **tasks** — `id` (PK), `column_id` (FK → columns), `title` (NOT NULL), `description`, `priority` (CHECK: Low/Medium/High), `created_at`

Foreign keys use `ON DELETE CASCADE` so deleting a board/column cleans up its children.

## Custom queries (beyond "get all rows")

**1. Tasks by priority, newest first** — `GET /api/tasks/priority/:level`
```sql
SELECT * FROM tasks WHERE priority = ? ORDER BY created_at DESC
```

**2. Task count per column** — `GET /api/boards/:id/task-counts`
```sql
SELECT column_id, COUNT(*) as task_count FROM tasks GROUP BY column_id
```

Both filter/aggregate at the database level, not in application code.

## Features implemented

- View board with columns and tasks
- Create / edit / delete tasks
- Move a task between columns (dropdown control)
- Filter tasks by priority
- Backend validation (empty title rejected with `400`, enforced server-side not just in the form)
- Graceful error handling on failed requests (no blank screen / raw console errors)
- Task count shown per column header (stretch goal)
- Seed script for fresh-database setup

## Assumptions & decisions

- Single board only — the app loads one fixed board (`BOARD_ID` in `App.jsx`) since multi-board support wasn't required by the spec.
- Used a dropdown to move tasks between columns instead of drag-and-drop, per the spec's suggestion that a working dropdown beats a broken drag-and-drop.
- Backend runs on port 4000 instead of the common default 5000, to avoid a local port conflict during development.

## What I'd improve with more time

- Add drag-and-drop as an alternative to the dropdown for moving tasks
- Add a text search box to filter tasks by title
- Add support for multiple boards

## Time spent

Roughly 3-4 hours total.

## Something I learned / found interesting

Working with `better-sqlite3`'s synchronous API was interesting — no async/await needed for queries, which simplified the route handlers compared to other Node database libraries I've seen. Adding a `CHECK` constraint directly in the schema (for the `priority` column) was a simple way to enforce valid values at the database level instead of only in application code.

🔗 **Live demo:** https://task-flow-dlcj.onrender.com
A simple task board app (Trello-lite) — Board → Columns → Tasks, built with React (frontend) and Node.js/Express + SQLite (backend).
