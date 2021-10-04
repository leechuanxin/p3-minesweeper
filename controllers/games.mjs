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
          flagCount: 0,
          turnCount: 0,
        };
        // create game state
        const gameState = {
          board: boardWithMines,
          printedBoard,
          player1,
          player2: null,
          totalMines: globals.MINE_COUNT,
          minesLeft: globals.MINE_COUNT,
          currentPlayerTurn: request.user.id,
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

        response.redirect(`/games/${game.id}`);
      }
    } catch (error) {
      response.send(`error: ${error.stack}`);
    }
  };

  const show = async (request, response) => {
    try {
      const { id } = request.params;
      const { user } = request;
      let title = '';
      const game = await db.Game.findOne({
        where: {
          id,
        },
      });

      if (!game) {
        throw new Error(globals.GAME_NOT_FOUND_ERROR_MESSAGE);
      }

      if (game.type === 'practice') {
        title = `${game.gameState.player1.realName}'s Practice Mode`;
      } else {
        title = '2 Player Game';
      }

      response.render('games/show', { user, game: game.dataValues, title });
    } catch (error) {
      if (error.message === globals.GAME_NOT_FOUND_ERROR_MESSAGE) {
        response.status(404).send(`Error 404: ${globals.GAME_NOT_FOUND_ERROR_MESSAGE}`);
      } else {
        response.send(`Error: ${error.message}`);
      }
    }
  };

  return {
    newForm,
    create,
    show,
  };
}
