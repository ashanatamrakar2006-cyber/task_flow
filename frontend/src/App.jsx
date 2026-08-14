import { useEffect, useState } from 'react';
import { getBoard } from './api/client';
import Board from './components/Board';
import './App.css';

const BOARD_ID = 1;

function App() {
  const [board, setBoard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBoard = async () => {
    try {
      setError(null);
      const data = await getBoard(BOARD_ID);
      setBoard(data);
    } catch (err) {
      setError('Failed to load board. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoard();
  }, []);

  if (loading) return <div className="status-message">Loading...</div>;
  if (error) return <div className="status-message error">{error}</div>;
  if (!board) return null;

  return (
    <div className="app">
      <h1>{board.name}</h1>
      <Board board={board} onRefresh={loadBoard} />
    </div>
  );
}

export default App;