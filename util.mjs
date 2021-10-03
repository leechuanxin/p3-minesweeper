import jsSHA from 'jssha';

// CUSTOM IMPORTS
import * as globals from './globals.mjs';

export const getHash = (input) => {
  // create new SHA object
  // eslint-disable-next-line new-cap
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });

  // create an unhashed cookie string based on user ID and salt
  const unhashedString = `${input}-${globals.SALT}`;

  // generate a hashed cookie string using SHA object
  shaObj.update(unhashedString);

  return shaObj.getHash('HEX');
};

export const getInvalidFormRequests = (obj) => Object.keys(obj).filter((key) => key.indexOf('invalid') >= 0);

export const setBoardGrid = (board, rowCount, colCount) => {
  const emptyBoard = [...board];
  for (let i = 0; i < rowCount; i += 1) {
    const row = [];
    for (let j = 0; j < colCount; j += 1) {
      const item = { value: ' ', opened: false, opened_by: 0 };
      row.push(item);
    }
    emptyBoard.push(row);
  }

  return emptyBoard;
};

export const setMinesAndNumbers = (board, rowCount, colCount, mineCount) => {
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

    if (dupBoard[randomRowIdx][randomColIdx].value !== '*') {
      dupBoard[randomRowIdx][randomColIdx].value = '*';
      currMineCount += 1;

      for (let k = randomRowIdx - 1; k <= randomRowIdx + 1; k += 1) {
        for (let l = randomColIdx - 1; l <= randomColIdx + 1; l += 1) {
          if (k < 0 || l < 0 || k >= rowCount || l >= colCount) {
            // eslint-disable-next-line no-continue
            continue;
          }

          if (dupBoard[k][l].value !== '*') {
            if (dupBoard[k][l].value === ' ') {
              dupBoard[k][l].value = '1';
            } else {
              const number = Number(dupBoard[k][l].value) + 1;
              dupBoard[k][l].value = number.toString();
            }
          }
        }
      }
    }
  }

  return dupBoard;
};

export const setPrintedBoard = (board, rowCount, colCount) => {
  // make a copy of board
  const dupBoard = [];
  board.forEach((row) => {
    const dupRow = [...row];
    dupBoard.push(dupRow);
  });

  // make another copy of board to retrieve current values
  const dupDupBoard = [];

  for (let i = 0; i < rowCount; i += 1) {
    const row = [];
    for (let j = 0; j < colCount; j += 1) {
      const item = { ...dupBoard[i][j] };
      if (!item.opened) {
        item.value = ' ';
      }
      row.push(item);
    }
    dupDupBoard.push(row);
  }

  return dupDupBoard;
};
