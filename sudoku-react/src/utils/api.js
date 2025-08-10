export async function fetchRandomPuzzle() {
  try {
    const response = await fetch('https://sugoku.onrender.com/board?difficulty=medium');
    const data = await response.json();
    return data.board; // Returns a 2D array representing the puzzle
  } catch (error) {
    console.error("Error fetching puzzle:", error);
    return Array(9).fill(null).map(() => Array(9).fill(0));
  }
}
// Encodes a Sudoku board for sending in a POST request
function encodeBoard(board) {
  return board.reduce((result, row, i) => {
    return result + `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? '' : '%2C'}`;
  }, '');
}

// Encodes parameters for POST request
function encodeParams(params) {
  return Object.keys(params)
    .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
    .join('&');
}
export async function solvePuzzle(board) {
  try {
    const response = await fetch('https://sugoku.onrender.com/solve', {
      method: 'POST',
      body: encodeParams({ board }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const data = await response.json();
    return data.solution; // Returns a 2D array with the solved board
  } catch (error) {
    console.error("Error solving puzzle:", error);
    return board;
  }
}
