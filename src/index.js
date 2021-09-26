import axios from 'axios';
import './styles.scss';

console.log('hello world');

const GRID_SIZE = 81;
const ROW_SIZE = 9;
const NUMBER_OF_ROWS = GRID_SIZE / ROW_SIZE;
const MINE_COUNT = 40;

const BOARD = [];

for (let i = 0; i < NUMBER_OF_ROWS; i += 1) {
  const ROW = [];
  for (let j = 0; j < ROW_SIZE; j += 1) {
    const ITEM = '';
    ROW.push(ITEM);
  }
  console.log('current row:', ROW);
  BOARD.push(ROW);
}

console.log('end of loops:', BOARD);
// generate random number of mines
const addMines = (board, mineCount) => {
  const dupBoard = board.slice();
  const rowCount = NUMBER_OF_ROWS;
  const colCount = ROW_SIZE;

  let currMineCount = 1;

  while (currMineCount <= mineCount) {
    const randomRowIdx = Math.floor(Math.random() * rowCount);
    const randomColIdx = Math.floor(Math.random() * colCount);

    if (dupBoard[randomRowIdx][randomColIdx] !== '*') {
      dupBoard[randomRowIdx][randomColIdx] = '*';
      currMineCount += 1;
    }
  }

  return dupBoard;
};

console.log('board with mines:', addMines(BOARD, MINE_COUNT));

// Make a request for all the items
// axios.get('/items')
//   .then((response) => {
//     // handle success
//     console.log(response.data.items);

//     const itemCont = document.createElement('div');

//     response.data.items.forEach((item) => {
//       const itemEl = document.createElement('div');
//       itemEl.innerText = JSON.stringify(item);
//       itemEl.classList.add('item');
//       document.body.appendChild(itemEl);
//     });

//     document.body.appendChild(itemCont);
//   })
//   .catch((error) => {
//     // handle error
//     console.log(error);
//   });
