import * as globals from '../globals.mjs';
import * as util from '../util.mjs';

export default function initGamesController(db) {
  const newForm = (request, response) => {
    if (!request.isUserLoggedIn) {
      response.redirect('/login');
    } else {
      const { user } = request;
      response.render('games/newForm', { user, game: {} });
    }
  };

  const create = async (request, response) => {
    try {
      if (!request.isUserLoggedIn) {
        const errorMessage = 'You have to be logged in to create a new game!';
        response.render('login', { userInfo: {}, genericSuccess: {}, genericError: { message: errorMessage } });
      } else {
        // create board
        const board = [];
        const boardWithGrid = util.setBoardGrid(
          board,
          globals.NUMBER_OF_ROWS,
          globals.NUMBER_OF_COLS,
        );
        const boardWithMines = util.setMinesAndNumbers(
          boardWithGrid,
          globals.NUMBER_OF_ROWS,
          globals.NUMBER_OF_COLS,
          globals.MINE_COUNT,
        );
        const printedBoard = util.setPrintedBoard(
          boardWithMines,
          globals.NUMBER_OF_ROWS,
          globals.NUMBER_OF_COLS,
        );
        // set player
        const player1 = {
          ...request.user,
          flag_count: 0,
          turn_count: 0,
        };
        // create game state
        const gameState = {
          board: boardWithMines,
          printed_board: printedBoard,
          player1,
          player2: null,
          total_mines: globals.MINE_COUNT,
          mines_left: globals.MINE_COUNT,
          current_player_turn: request.user.id,
        };

        // initialize new game
        const newGame = {
          ...request.body,
          createdUserId: request.user.id,
          gameState,
          playerUserId: null,
          winnerUserId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const game = await db.Game.create(newGame);
        console.log('new game:', game);

        response.redirect(`/game/${game.id}`);
      }
    } catch (error) {
      response.send(`error: ${error.stack}`);
    }
  };

  return {
    newForm,
    create,
  };
}
