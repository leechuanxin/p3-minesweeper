import 'regenerator-runtime/runtime';
import './styles.scss';

// CUSTOM IMPORTS
import * as gameUI from './game_ui.js';
import * as cookie from './cookie.js';

// Logic
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
  setInterval(gameUI.handleRefresh(gameId, userId, canClick), 3100);
}
