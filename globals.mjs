// GLOBAL CONSTANTS
export const { SALT } = process.env;
export const USERNAME_EXISTS_ERROR_MESSAGE = 'Username exists!';
export const LOGIN_FAILED_ERROR_MESSAGE = 'Login failed!';
export const GAME_NOT_FOUND_ERROR_MESSAGE = 'Game not found!';
export const GAME_CANT_PLAY_USER_NOT_LOGGED_IN = 'You need to be logged in to play the game!';
export const GAME_CANT_FORFEIT_USER_NOT_LOGGED_IN = 'You need to be logged in to forfeit the game!';
export const GAME_CANT_FORFEIT_USER_NOT_PLAYER = 'You need to be a player in this game to forfeit the game!';
export const GAME_CANT_CREATE_WHEN_ANOTHER_GAME = 'You can\'t create another game when you have a game running!';
export const GAME_CANT_JOIN_WHEN_ANOTHER_GAME = 'You can\'t join another game when you have a game running!';
export const GAME_CANT_JOIN_PRACTICE = 'You can\'t join a practice game!';
export const GAME_CANT_JOIN_ANOTHER_PLAYER = 'This game already has 2 players! You can\'t join it!';
export const GAME_NOT_CURRENT_TURN = 'It needs to be your turn to click on a tile!';
export const GRID_SIZE = 252;
export const NUMBER_OF_COLS = 12;
export const NUMBER_OF_ROWS = Math.floor(GRID_SIZE / NUMBER_OF_COLS);
export const MINE_COUNT = 51;
