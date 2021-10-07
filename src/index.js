import axios from 'axios';
import 'regenerator-runtime/runtime';
import './styles.scss';

const handleTileClick = (board, gameId) => (e) => {
  const targetId = e.currentTarget.id;
  const rowIdx = Number(targetId.split('_')[0]);
  const colIdx = Number(targetId.split('_')[1]);
  axios.put(`/games/${gameId}/row/${rowIdx}/col/${colIdx}/update`)
    .then((response) => {
      console.log('response.data:', response.data);
    });
  // if (board[rowIdx][colIdx].value.trim() !== '*') {
  //   updateTurnCount();
  // }

  // // open tiles
  // getOpenTiles(board, rowIdx, colIdx);
  // printBoard(board);
};

const handleTilesClick = (board, gameId) => {
  const tiles = document.querySelectorAll('.col-1.unopened');

  tiles.forEach((tile) => {
    tile.addEventListener('click', handleTileClick(board, gameId));
  });
};

// Logic
let board = [];
const gameIdSpan = document.querySelector('#gameId');
let gameId = 0;
if (gameIdSpan) {
  gameId = Number(gameIdSpan.innerText);
}

if (gameId !== 0 && !Number.isNaN(gameId)) {
  axios.get(`/games/${gameId}/show`)
    .then((response) => {
      const currentGame = response.data.game;
      board = currentGame.gameState.printedBoard;
      handleTilesClick(board, gameId);
    })
    .catch((error) => {
      console.log('error');
    });
}

// const GRID_SIZE = 252;
// const NUMBER_OF_COLS = 12;
// const NUMBER_OF_ROWS = Math.floor(GRID_SIZE / NUMBER_OF_COLS);
// const MINE_COUNT = 51;
// const TURN_COUNT = 1;

// const BOARD = [];

// const setBoardGrid = (board, rowCount, colCount) => {
//   const emptyBoard = [...board];
//   for (let i = 0; i < rowCount; i += 1) {
//     const row = [];
//     for (let j = 0; j < colCount; j += 1) {
//       const item = { value: ' ', opened: false };
//       row.push(item);
//     }
//     emptyBoard.push(row);
//   }

//   return emptyBoard;
// };

// const setMinesAndNumbers = (board, rowCount, colCount, mineCount) => {
//   // make a copy of board
//   const dupBoard = [];
//   board.forEach((row) => {
//     const dupRow = [...row];
//     dupBoard.push(dupRow);
//   });

//   let currMineCount = 1;

//   while (currMineCount <= mineCount) {
//     const randomRowIdx = Math.floor(Math.random() * rowCount);
//     const randomColIdx = Math.floor(Math.random() * colCount);

//     if (dupBoard[randomRowIdx][randomColIdx].value !== '*') {
//       dupBoard[randomRowIdx][randomColIdx].value = '*';
//       currMineCount += 1;

//       for (let k = randomRowIdx - 1; k <= randomRowIdx + 1; k += 1) {
//         for (let l = randomColIdx - 1; l <= randomColIdx + 1; l += 1) {
//           if (k < 0 || l < 0 || k >= rowCount || l >= colCount) {
//             continue;
//           }

//           if (dupBoard[k][l].value !== '*') {
//             if (dupBoard[k][l].value === ' ') {
//               dupBoard[k][l].value = '1';
//             } else {
//               const number = Number(dupBoard[k][l].value) + 1;
//               dupBoard[k][l].value = number.toString();
//             }
//           }
//         }
//       }
//     }
//   }

//   return dupBoard;
// };

// const countMines = (board) => {
//   let sum = 0;
//   for (let i = 0; i < board.length; i += 1) {
//     const row = board[i];
//     for (let j = 0; j < row.length; j += 1) {
//       if (board[i][j].value === '*') {
//         sum += 1;
//       }
//     }
//   }

//   return sum;
// };

// const updateTurnCount = () => {
//   const turnCountSpan = document.querySelector('#turnCount');
//   let turnCount = Number(turnCountSpan.innerText);
//   turnCount += 1;
//   turnCountSpan.innerText = turnCount.toString();
// };

// const getOpenTiles = (board, row, col) => {
//   // base cases
//   if (
//     row < 0
//     || row >= board.length
//     || col < 0
//     || col >= board[0].length
//     || board[row][col].opened === true
//   ) {
//     return;
//   }

//   // number or mine
//   if (board[row][col].value.trim() !== '') {
//     board[row][col].opened = true;
//     return;
//   }

//   board[row][col].opened = true;

//   // go top
//   getOpenTiles(board, row - 1, col);
//   // go bottom
//   getOpenTiles(board, row + 1, col);
//   // go left
//   getOpenTiles(board, row, col - 1);
//   // go right
//   getOpenTiles(board, row, col + 1);
//   // go top-left
//   getOpenTiles(board, row - 1, col - 1);
//   // go top-right
//   getOpenTiles(board, row - 1, col + 1);
//   // go bottom-left
//   getOpenTiles(board, row + 1, col - 1);
//   // go bottom-right
//   getOpenTiles(board, row + 1, col + 1);
// };

// const printBoard = (board) => {
//   const minesweeper = document.querySelector('#msWrapper');
//   minesweeper.classList.add('ms-wrapper');
//   minesweeper.innerHTML = '';
//   // print columns
//   for (let i = 0; i < board.length; i += 1) {
//     const row = document.createElement('div');
//     row.className = 'row';
//     for (let j = 0; j < NUMBER_OF_COLS; j += 1) {
//       const col = document.createElement('div');
//       col.className = 'col-1';
//       const span = document.createElement('span');
//       col.id = `${i}_${j}`;

//       if (!board[i][j].opened) {
//         col.classList.add('unopened');
//         span.innerText = '';
//       } else {
//         col.classList.remove('unopened');
//         span.innerText = board[i][j].value;
//       }

//       col.appendChild(span);
//       row.appendChild(col);
//     }
//     minesweeper.appendChild(row);
//   }

//   handleTilesClick(board);
// };

// const boardWithGrid = setBoardGrid(BOARD, NUMBER_OF_ROWS, NUMBER_OF_COLS);
// const boardWithMines = setMinesAndNumbers(
//   boardWithGrid,
//   NUMBER_OF_ROWS,
//   NUMBER_OF_COLS,
//   MINE_COUNT,
// );

// console.log('starter board:', BOARD);
// console.log('empty board:', boardWithGrid);
// console.log('begin setting mines and numbers:', boardWithMines);
// console.log('total mine count:', countMines(boardWithMines));

// printBoard(boardWithMines);
