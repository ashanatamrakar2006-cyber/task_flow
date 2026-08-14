const express = require('express');
const cors = require('cors');

const boardsRouter = require('./routes/boards');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/boards', boardsRouter);
app.use('/api/tasks', tasksRouter);

// Basic health check
app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API is running' });
});

// Fallback error handler (catches unexpected errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});