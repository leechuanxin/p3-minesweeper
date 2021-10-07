// GLOBAL CONSTANTS
export const { SALT } = process.env;
export const USERNAME_EXISTS_ERROR_MESSAGE = 'Username exists!';
export const LOGIN_FAILED_ERROR_MESSAGE = 'Login failed!';
export const GAME_NOT_FOUND_ERROR_MESSAGE = 'Game not found!';
export const GAME_CANT_PLAY_USER_NOT_LOGGED_IN = 'You need to be logged in to play the game!';
export const GAME_NOT_CURRENT_TURN = 'It needs to be your turn to click on a tile!';
export const GRID_SIZE = 252;
export const NUMBER_OF_COLS = 12;
export const NUMBER_OF_ROWS = Math.floor(GRID_SIZE / NUMBER_OF_COLS);
export const MINE_COUNT = 51;
