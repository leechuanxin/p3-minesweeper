import axios from 'axios';
import 'regenerator-runtime/runtime';
import './styles.scss';

const getCookie = (cname) => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

const handleTileClick = (board, gameId, canClick, userId) => (e) => {
  const targetId = e.currentTarget.id;
  const rowIdx = Number(targetId.split('_')[0]);
  const colIdx = Number(targetId.split('_')[1]);
  if (canClick.value === true) {
    canClick.value = false;
    axios.put(`/games/${gameId}/row/${rowIdx}/col/${colIdx}/update`)
      .then((response) => {
        const currentGame = response.data;
        const { printedBoard } = response.data.gameState;
        if (userId === currentGame.gameState.currentPlayerTurn) {
          canClick.value = true;
        }
        printBoard(printedBoard, gameId, currentGame, canClick, userId);
        printUi(currentGame);
        printGameOverFeedback(currentGame, userId);
      })
      .catch((error) => {
        console.log('error:', error);
      });
  }
};

const handleTilesClick = (board, gameId, canClick, userId) => {
  const tiles = document.querySelectorAll('.col-1.unopened');

  tiles.forEach((tile) => {
    tile.addEventListener('click', handleTileClick(board, gameId, canClick, userId));
  });
};

const printBoard = (board, gameId, game, canClick, userId) => {
  const minesweeper = document.querySelector('#msWrapper');
  minesweeper.classList.add('ms-wrapper');
  minesweeper.innerHTML = '';
  // print columns
  for (let i = 0; i < board.length; i += 1) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let j = 0; j < board[0].length; j += 1) {
      const col = document.createElement('div');
      col.className = 'col-1';
      const span = document.createElement('span');
      col.id = `${i}_${j}`;

      if (!board[i][j].opened) {
        col.classList.add('unopened');
        if (canClick.value === true) {
          col.classList.add('can-click');
        }
        span.innerText = '';
      } else {
        col.classList.remove('unopened');
        if (board[i][j].opened_by === game.gameState.player1.id) {
          col.classList.add('player1-opened');
        } else if (game.gameState.player2 && board[i][j].opened_by === game.gameState.player2.id) {
          col.classList.add('player2-opened');
        } else {
          col.classList.add('game-over-opened');
        }

        if (
          board[i][j].value === '*'
          && (
            board[i][j].opened_by === game.gameState.player1.id
            || (game.gameState.player2 && board[i][j].opened_by === game.gameState.player2.id)
          )
        ) {
          span.innerHTML = "<i class='fas fa-flag'></i>";
        } else if (board[i][j].value === '*') {
          span.innerHTML = "<i class='fas fa-bomb'></i>";
        } else {
          span.innerHTML = `<strong>${board[i][j].value}</strong>`;
          switch (board[i][j].value) {
            case '1':
              span.classList.add('opened-1');
              break;
            case '2':
              span.classList.add('opened-2');
              break;
            case '3':
              span.classList.add('opened-3');
              break;
            case '4':
              span.classList.add('opened-4');
              break;
            case '5':
              span.classList.add('opened-5');
              break;
            case '6':
              span.classList.add('opened-6');
              break;
            case '7':
              span.classList.add('opened-7');
              break;
            case '8':
              span.classList.add('opened-8');
              break;
            default:
              break;
          }
        }
      }

      col.appendChild(span);
      row.appendChild(col);
    }
    minesweeper.appendChild(row);
  }

  handleTilesClick(board, gameId, canClick, userId);
};

const printUi = (game) => {
  const loggedInUserIdText = getCookie('userId');
  const loggedInUserId = Number(loggedInUserIdText);
  const profileWrapper = document.querySelector('#profileWrapper');
  profileWrapper.classList.add('profile-wrapper');
  profileWrapper.innerHTML = '';
  const { player1 } = game.gameState;
  const { player2 } = game.gameState;
  const player1ImageSeed = player1
    .realName
    .toLowerCase()
    .split(' ')
    .join('-')
    .split("'")
    .join('-')
    .concat(`-${player1.id}`);
  let player2ImageSeed = player2 ? player2.realName : '';
  const player2Id = player2 ? player2.id : 0;
  player2ImageSeed = player2ImageSeed
    .toLowerCase()
    .split(' ')
    .join('-')
    .split("'")
    .join('-')
    .concat(`-${player2Id}`);
  const player1Image = `https://avatars.dicebear.com/api/gridy/${player1ImageSeed}.svg`;
  const player2Image = `https://avatars.dicebear.com/api/gridy/${player2ImageSeed}.svg`;
  let player1TurnText = '';
  const minesLeftText = game.gameState.minesLeft;

  if (loggedInUserId === player1.id && game.winnerUserId === player1.id) {
    player1TurnText = 'You have won this game!';
  } else if (game.winnerUserId === player1.id) {
    player1TurnText = `${player1.realName} has won this game!`;
  } else if (player2 && loggedInUserId === player1.id && game.winnerUserId === player2.id) {
    player1TurnText = 'You have lost this game!';
  } else if (player2 && game.winnerUserId === player2.id) {
    player1TurnText = `${player1.realName} has lost this game!`;
  } else if (loggedInUserId === player1.id && game.gameState.currentPlayerTurn === loggedInUserId) {
    player1TurnText = "It's your turn now! Please make a move.";
  } else if (game.gameState.currentPlayerTurn === player1.id) {
    player1TurnText = `Waiting for ${player1.realName} to make a move...`;
  }

  profileWrapper.innerHTML = `
    <div class="player1-profile ps-3 pe-3 pt-3 pb-5">
      <span class="square-image-wrapper mb-3">
        <span class="square-image circle">
          <img src="${player1Image}" />
        </span>
      </span>
      <p class="text-center text-truncated mb-3">
        <strong>${player1.realName}</strong>
      </p>
      <div class="divider"></div>
      <p class="text-center pt-1 pb-1 mt-3 mb-3">${player1TurnText}</p>
      <div class="divider"></div>
      <div class="row mt-3">
        <div class="col-10 m-auto">
          <div class="row counter-container">
            <div class="col-4 p-2 text-center">
              <span>
                <i class="fas fa-flag"></i>
              </span>
            </div>
            <div class="col-8 p-2 text-center">
              <span>
                <strong>${player1.flagCount}</strong>
              </span>
            </div>
            <div class="col-4 p-2 text-center">
              <span>
                <i class="far fa-clock"></i>
              </span>
            </div>
            <div class="col-8 p-2 text-center">
              <span>
                <strong>${player1.turnCount}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mines-left-profile w-100 ps-3 pe-3 pt-3 pb-3">
      <div class="row">
        <div class="col-4 text-center">
          <span class="fs-2">
            <i class="fas fa-bomb"></i>
          </span>
        </div>
        <div class="col-4 position-relative">
          <div class="mines-left-header">
            <span class="fs-2">
              <strong>
                ${minesLeftText}
              </strong>
            </span>
          </div>
        </div>
        <div class="col-4 text-center">
          <span class="fs-2">
            <i class="fas fa-bomb"></i>
          </span>
        </div>
      </div>
    </div>
  `;
  console.log('print ui:', game);
  console.log('player 1 image:', player1Image);
  console.log('player 2 image:', player2Image);
};

const printGameOverFeedback = (game, userId) => {
  const hasWinner = (typeof game.winnerUserId === 'number');
  let gameOverText = '';
  const gameOverFeedbackCol = document.querySelector('#gameOverFeedbackCol');

  if (hasWinner && game.winnerUserId === userId) {
    // user winner
    gameOverText = 'You have won this game, and this game is over!';
  } else if (
    hasWinner
    && game.winnerUserId !== userId
    && (
      userId === game.gameState.player1.id
      || (game.gameState.player2 && userId === game.gameState.player2.id)
    )
  ) {
    // user loser
    gameOverText = 'You have lost this game, and this game is over!';
  } else if (hasWinner) {
    // user spectator
    gameOverText = 'This game is over!';
  }

  gameOverText += ' You can <a href="/">view other games here</a>';

  if (userId > 0) {
    gameOverText += ', or <a href="/games/new">start a new game here</a>';
  }

  gameOverText += '.';

  if (gameOverFeedbackCol && hasWinner) {
    gameOverFeedbackCol.innerHTML = `
      <p class="text-center">
        <span>${gameOverText}</span>
      </p>
    `;
  }
};

// Logic
let board = [];
const canClick = {
  value: false,
};
const gameIdSpan = document.querySelector('#gameId');
let gameId = 0;
const userId = (getCookie('userId') === '') ? 0 : Number(getCookie('userId'));
if (gameIdSpan) {
  gameId = Number(gameIdSpan.innerText);
}

if (gameId !== 0 && !Number.isNaN(gameId)) {
  axios.get(`/games/${gameId}/show`)
    .then((response) => {
      const currentGame = response.data.game;
      board = currentGame.gameState.printedBoard;
      if (userId === currentGame.gameState.currentPlayerTurn) {
        canClick.value = true;
      }
      printBoard(board, gameId, currentGame, canClick, userId);
      printUi(currentGame);
      printGameOverFeedback(currentGame, userId);
    })
    .catch((error) => {
      console.log('error:', error);
    });
}
