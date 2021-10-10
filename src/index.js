import axios from 'axios';
import 'regenerator-runtime/runtime';
import './styles.scss';

// CUSTOM IMPORTS
import * as gameUI from './game_ui.js';
import * as cookie from './cookie.js';

// Logic
let board = [];
const canClick = {
  value: false,
};
const gameIdSpan = document.querySelector('#gameId');
let gameId = 0;
const userId = (cookie.getCookie('userId') === '') ? 0 : Number(cookie.getCookie('userId'));
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
      gameUI.printBoard(board, gameId, currentGame, canClick, userId);
      gameUI.printUi(currentGame);
      gameUI.printGameOverFeedback(currentGame, userId);
      gameUI.printForfeitButton(currentGame, userId, canClick);
    })
    .catch((error) => {
      console.log('error:', error);
    });
}
