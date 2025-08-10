import React from 'react';
import './sudokuBoard.css';

const SudokuBoard = ({ puzzle, setPuzzle, original }) => {
  const handleChange = (row, col, value) => {
    const val = parseInt(value);
    const updated = [...puzzle];
    if (!isNaN(val) && val >= 1 && val <= 9) {
      updated[row][col] = val;
    } else if (value === '') {
      updated[row][col] = 0;
    }
    setPuzzle(updated);
  };

  if (!puzzle || puzzle.length === 0) return <p>Loading...</p>;

  return (
    <div className="board">
      {puzzle.map((row, i) => (
        <div key={i} className="row">
          {row.map((num, j) => (
            <input
              key={`${i}-${j}`}
              className="cell"
              value={num === 0 ? '' : num}
              onChange={(e) => handleChange(i, j, e.target.value)}
              disabled={original[i][j] !== 0}
              maxLength="1"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SudokuBoard;



    
  

