import axios from 'axios';

// CUSTOM IMPORTS
import * as cookie from './cookie.js';

export const handleRefresh = (gameId, userId, canClick) => () => {
  const button = document.querySelector('#forfeitButton');
  if (button) {
    button.disabled = true;
  }
  axios.get(`/games/${gameId}/show`)
    .then((response) => {
      if (button) {
        button.disabled = false;
      }
      const currentGame = response.data.game;
      const board = currentGame.gameState.printedBoard;
      if (userId === currentGame.gameState.currentPlayerTurn) {
        canClick.value = true;
      }
      printBoard(board, gameId, currentGame, canClick, userId);
      printUi(currentGame);
      printGameOverFeedback(currentGame, userId);
      printForfeitButton(currentGame, userId, canClick);
    })
    .catch((error) => {
      if (button) {
        button.disabled = false;
      }
      console.log('error:', error);
    });
};

export const handleTileClick = (board, gameId, canClick, userId) => (e) => {
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
        printForfeitButton(currentGame, userId, canClick);
      })
      .catch((error) => {
        console.log('error:', error);
      });
  }
};

export const handleTilesClick = (board, gameId, canClick, userId) => {
  const tiles = document.querySelectorAll('.col-1.unopened');

  tiles.forEach((tile) => {
    tile.addEventListener('click', handleTileClick(board, gameId, canClick, userId));
  });
};

export const printBoard = (board, gameId, game, canClick, userId) => {
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

export const printUi = (game) => {
  const loggedInUserIdText = cookie.getCookie('userId');
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
  let player2ImageSeed = player2 && player2.realName ? player2.realName : '';
  const player2Id = player2 && player2.id ? player2.id : 0;
  player2ImageSeed = player2ImageSeed
    .toLowerCase()
    .split(' ')
    .join('-')
    .split("'")
    .join('-')
    .concat(`-${player2Id}`);
  const player1Image = `https://avatars.dicebear.com/api/gridy/${player1ImageSeed}.svg`;
  const player2Image = (player2Id === 0) ? 'https://avatars.dicebear.com/api/pixel-art-neutral/0.svg' : `https://avatars.dicebear.com/api/gridy/${player2ImageSeed}.svg`;
  let player1TurnText = '';
  let player2TurnText = '';
  let player2JoinButton = '';
  const minesLeftText = game.gameState.minesLeft;
  const { currentPlayerTurn } = game.gameState;
  let player1TurnArrowDisplay = '';
  let player2TurnArrowDisplay = '';

  if (currentPlayerTurn === player1.id) {
    player1TurnArrowDisplay = '';
    player2TurnArrowDisplay = ' d-none';
  } else if (player2 && currentPlayerTurn === player2.id) {
    player1TurnArrowDisplay = ' d-none';
    player2TurnArrowDisplay = '';
  } else {
    player1TurnArrowDisplay = ' d-none';
    player2TurnArrowDisplay = ' d-none';
  }

  if (game.isCompleted && loggedInUserId === player1.id && game.winnerUserId === player1.id) {
    player1TurnText = 'You have won this game!';
  } else if (game.isCompleted && game.winnerUserId === player1.id) {
    player1TurnText = `${player1.realName} has won this game!`;
  } else if (game.isCompleted && loggedInUserId === player1.id) {
    player1TurnText = 'You have lost this game!';
  } else if (game.isCompleted) {
    player1TurnText = `${player1.realName} has lost this game!`;
  } else if (loggedInUserId === player1.id && game.type === 'twoplayer' && !game.playerUserId) {
    player1TurnText = 'Please be patient and wait for another player to join the game!';
  } else if (game.type === 'twoplayer' && !game.playerUserId) {
    player1TurnText = `${player1.realName} is waiting for another player to join the game...`;
  } else if (loggedInUserId === player1.id && game.gameState.currentPlayerTurn === loggedInUserId) {
    player1TurnText = "It's your turn now! Please make a move.";
  } else if (game.gameState.currentPlayerTurn === player1.id) {
    player1TurnText = `Waiting for ${player1.realName} to make a move...`;
  }

  if (game.isCompleted && loggedInUserId === player2.id && game.winnerUserId === player2.id) {
    player2TurnText = 'You have won this game!';
  } else if (game.isCompleted && game.winnerUserId === player2.id) {
    player2TurnText = `${player2.realName} has won this game!`;
  } else if (game.isCompleted && loggedInUserId === player2.id) {
    player2TurnText = 'You have lost this game!';
  } else if (game.isCompleted) {
    player2TurnText = `${player2.realName} has lost this game!`;
  } else if (loggedInUserId !== game.createdUserId && game.type === 'twoplayer' && !game.playerUserId) {
    player2TurnText = `This could be you! Join this game to challenge ${player1.realName}!`;
    if (loggedInUserId) {
      player2JoinButton = '<div class="text-center mb-3"><button id="joinGameButton" class="btn btn-success">Join Game</button></div>';
    }
  } else if (
    player2
    && player2.id
    && loggedInUserId === player2.id
    && game.gameState.currentPlayerTurn === loggedInUserId) {
    player2TurnText = "It's your turn now! Please make a move.";
  } else if (
    player2
    && player2.id
    && game.gameState.currentPlayerTurn === player2.id
  ) {
    player2TurnText = `Waiting for ${player2.realName} to make a move...`;
  }

  profileWrapper.innerHTML = `
    <div class="player1-profile ps-3 pe-3 pt-5 pb-5">
      <div class="player1-arrow${player1TurnArrowDisplay}">
        <div class="animate__animated animate__bounce animate__infinite">
          <i class="fas fa-location-arrow"></i>
        </div>
      </div>
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

  if (game.type === 'twoplayer') {
    profileWrapper.innerHTML += `
      <div class="player2-profile ps-3 pe-3 pt-5 pb-5">
      <div class="player2-arrow${player2TurnArrowDisplay}">
        <div class="animate__animated animate__bounce animate__infinite">
          <i class="fas fa-location-arrow"></i>
        </div>
      </div>
      <span class="square-image-wrapper mb-3">
        <span class="square-image circle">
          <img src="${player2Image}" />
        </span>
      </span>
      <p class="text-center text-truncated mb-3">
        <strong>${player2 && player2.realName ? player2.realName : '???'}</strong>
      </p>
      <div class="divider"></div>
      <p class="text-center pt-1 pb-1 mt-3 mb-3">${player2TurnText}</p>
      ${player2JoinButton}
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
                <strong>${player2 && player2.flagCount ? player2.flagCount : 0}</strong>
              </span>
            </div>
            <div class="col-4 p-2 text-center">
              <span>
                <i class="far fa-clock"></i>
              </span>
            </div>
            <div class="col-8 p-2 text-center">
              <span>
                <strong>${player2 && player2.turnCount ? player2.turnCount : 0}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  }
  console.log('print ui:', game);
  console.log('player 1 image:', player1Image);
  console.log('player 2 image:', player2Image);
};

export const printGameOverFeedback = (game, userId) => {
  const hasWinner = game.isCompleted;
  let gameOverText = '';
  const gameOverFeedbackCol = document.querySelector('#gameOverFeedbackCol');
  // remove elements in gameOverFeedbackCol
  gameOverFeedbackCol.innerHTML = '';

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

export const printForfeitButton = (game, userId, canClick) => {
  const forfeitButtonContainer = document.querySelector('#forfeitButtonContainer');
  // clear forfeit button container first
  if (forfeitButtonContainer) {
    forfeitButtonContainer.innerHTML = '';
  }
  if (
    forfeitButtonContainer
    && !game.isCompleted
    && (userId === game.createdUserId || userId === game.playerUserId)
  ) {
    forfeitButtonContainer.innerHTML = "<button id='forfeitButton' class='btn btn-danger'>Forfeit</button>";
  }
  const button = document.querySelector('#forfeitButton');
  if (button) {
    button.addEventListener('click', () => {
      button.disabled = true;
      canClick.value = false;
      axios.put(`/games/${game.id}/forfeit`)
        .then((response) => {
          button.disabled = false;
          const currentGame = response.data;
          const { printedBoard } = response.data.gameState;
          if (userId === currentGame.gameState.currentPlayerTurn) {
            canClick.value = true;
          }
          printBoard(printedBoard, currentGame.id, currentGame, canClick, userId);
          printUi(currentGame);
          printGameOverFeedback(currentGame, userId);
          printForfeitButton(currentGame, userId, canClick);
        })
        .catch((error) => {
          button.disabled = false;
          console.log('error:', error);
        });
    });
  }
};
