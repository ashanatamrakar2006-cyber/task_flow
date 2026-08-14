const express = require('express');
const cors = require('cors');
const path = require('path');
const boardsRouter = require('./routes/boards');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/api/boards', boardsRouter);
app.use('/api/tasks', tasksRouter);

// Serve frontend build
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Fallback error handler (catches unexpected errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('close', () => {
  console.log('SERVER SOCKET CLOSED');
});

server.on('error', (err) => {
  console.error('SERVER ERROR:', err);
});

process.on('exit', (code) => {
  console.log('Process exiting with code:', code);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});