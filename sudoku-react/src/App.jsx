import React, { useState, useEffect } from 'react';
import SudokuBoard from './components/sudokuBoard.jsx';  // Capitalized import to follow React conventions
import { fetchPuzzle, fetchRandomPuzzle } from './utils/api';  // import both fetch functions
import { solveSudoku } from './utils/solver';

const initialBoard = Array(9).fill(null).map(() => Array(9).fill(0));

const App = () => {
  // State for current puzzle, original fixed puzzle, and dark mode + timer
  const [puzzle, setPuzzle] = useState(initialBoard);
  const [original, setOriginal] = useState(initialBoard);
  const [darkMode, setDarkMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  // Load a new puzzle from API and reset timer
  const loadPuzzle = async () => {
    const data = await fetchRandomPuzzle();
    if (data) {
      setPuzzle(data);
      setOriginal(JSON.parse(JSON.stringify(data))); // deep copy
      clearInterval(intervalId);
      setTimer(0);
      const id = setInterval(() => setTimer(t => t + 1), 1000);
      setIntervalId(id);
    }
  };

  // Load saved time on mount
  useEffect(() => {
    loadPuzzle();
    const savedTime = localStorage.getItem('sudoku-timer');
    if (savedTime) setTimer(parseInt(savedTime));
  }, []);

  // Save timer on change
  useEffect(() => {
    localStorage.setItem('sudoku-timer', timer);
  }, [timer]);

  // Solve current puzzle using local solver
  const handleSolve = () => {
    const solved = solveSudoku(JSON.parse(JSON.stringify(puzzle)));
    if (solved) setPuzzle(solved);
  };

  // Toggle dark mode
  const toggleMode = () => {
    setDarkMode(!darkMode);
  };

  // Save current game to localStorage
  const saveGame = () => {
    localStorage.setItem('sudoku-game', JSON.stringify(puzzle));
    localStorage.setItem('sudoku-original', JSON.stringify(original));
  };

  // Load saved game from localStorage
  const loadSavedGame = () => {
    const saved = JSON.parse(localStorage.getItem('sudoku-game'));
    const orig = JSON.parse(localStorage.getItem('sudoku-original'));
    if (saved && orig) {
      setPuzzle(saved);
      setOriginal(orig);
    }
  };

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <h1>Sudoku App</h1>
      <div className="controls">
        <button onClick={loadPuzzle}>🔄 New Game</button>
        <button onClick={handleSolve}>✔️ Solve</button>
        <button onClick={saveGame}>💾 Save</button>
        <button onClick={loadSavedGame}>📂 Load</button>
        <button onClick={toggleMode}>🌓 Toggle Mode</button>
        <span>⏱️ {timer}s</span>
      </div>
      <SudokuBoard puzzle={puzzle} setPuzzle={setPuzzle} original={original} />
    </div>
  );
};

export default App;


