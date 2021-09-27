import axios from 'axios';
import './styles.scss';

console.log('hello world');

const GRID_SIZE = 252;
const NUMBER_OF_COLS = 12;
const NUMBER_OF_ROWS = Math.floor(GRID_SIZE / NUMBER_OF_COLS);
const MINE_COUNT = 51;

const BOARD = [];

const setBoardGrid = (board, rowCount, colCount) => {
  const emptyBoard = [...board];
  for (let i = 0; i < rowCount; i += 1) {
    const row = [];
    for (let j = 0; j < colCount; j += 1) {
      const item = ' ';
      row.push(item);
    }
    emptyBoard.push(row);
  }

  return emptyBoard;
};

const setMinesAndNumbers = (board, rowCount, colCount, mineCount) => {
  // make a copy of board
  const dupBoard = [];
  board.forEach((row) => {
    const dupRow = [...row];
    dupBoard.push(dupRow);
  });

  let currMineCount = 1;

  while (currMineCount <= mineCount) {
    const randomRowIdx = Math.floor(Math.random() * rowCount);
    const randomColIdx = Math.floor(Math.random() * colCount);

    if (dupBoard[randomRowIdx][randomColIdx] !== '*') {
      dupBoard[randomRowIdx][randomColIdx] = '*';
      currMineCount += 1;

      for (let k = randomRowIdx - 1; k <= randomRowIdx + 1; k += 1) {
        for (let l = randomColIdx - 1; l <= randomColIdx + 1; l += 1) {
          if (k < 0 || l < 0 || k >= rowCount || l >= colCount) {
            continue;
          }

          if (dupBoard[k][l] !== '*') {
            if (dupBoard[k][l] === ' ') {
              dupBoard[k][l] = '1';
            } else {
              const number = Number(dupBoard[k][l]) + 1;
              dupBoard[k][l] = number.toString();
            }
          }
        }
      }
    }
  }

  return dupBoard;
};

const countMines = (board) => {
  let sum = 0;
  for (let i = 0; i < board.length; i += 1) {
    const row = board[i];
    for (let j = 0; j < row.length; j += 1) {
      if (board[i][j] === '*') {
        sum += 1;
      }
    }
  }

  return sum;
};

const printBoard = (board) => {
  const minesweeper = document.querySelector('#msWrapper');
  minesweeper.classList.add('minesweeper');
  // print columns
  for (let i = 0; i < board.length; i += 1) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let j = 0; j < NUMBER_OF_COLS; j += 1) {
      const col = document.createElement('div');
      col.className = 'col-1';
      const span = document.createElement('span');
      span.innerText = board[i][j];
      col.appendChild(span);
      row.appendChild(col);
    }
    minesweeper.appendChild(row);
  }
};

const boardWithGrid = setBoardGrid(BOARD, NUMBER_OF_ROWS, NUMBER_OF_COLS);
const boardWithMines = setMinesAndNumbers(
  boardWithGrid,
  NUMBER_OF_ROWS,
  NUMBER_OF_COLS,
  MINE_COUNT,
);

console.log('starter board:', BOARD);
console.log('empty board:', boardWithGrid);
console.log('begin setting mines and numbers:', boardWithMines);
console.log('total mine count:', countMines(boardWithMines));

printBoard(boardWithMines);
