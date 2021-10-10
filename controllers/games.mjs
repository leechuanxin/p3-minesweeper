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
        const currentGame = await db.Game.findOne({
          where: {
            [db.Sequelize.Op.and]: [
              {
                [db.Sequelize.Op.or]: [
                  { createdUserId: request.user.id },
                  { playerUserId: request.user.id },
                ],
              },
              {
                isCompleted: {
                  [db.Sequelize.Op.eq]: false,
                },
              },
            ],
          },
        });

        if (currentGame) {
          throw new Error(globals.GAME_CANT_CREATE_WHEN_ANOTHER_GAME);
        }
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
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const game = await db.Game.create(newGame);

        response.redirect(`/games/${game.id}`);
      }
    } catch (error) {
      if (error.message === globals.GAME_CANT_CREATE_WHEN_ANOTHER_GAME) {
        response.status(401).send(`Error 401: ${error.message}`);
      } else {
        response.send(`Error: ${error.message}`);
      }
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

      const renderedGame = {
        id: game.dataValues.id,
      };

      response.render('games/show', { user, game: renderedGame, title });
    } catch (error) {
      if (error.message === globals.GAME_NOT_FOUND_ERROR_MESSAGE) {
        response.status(404).send(`Error 404: ${globals.GAME_NOT_FOUND_ERROR_MESSAGE}`);
      } else {
        response.send(`Error: ${error.message}`);
      }
    }
  };

  const showAjax = async (request, response) => {
    try {
      const { id } = request.params;
      const game = await db.Game.findOne({
        where: {
          id,
        },
      });

      if (!game) {
        throw new Error(globals.GAME_NOT_FOUND_ERROR_MESSAGE);
      }

      const renderedGame = { ...game.dataValues };
      const gameState = {
        printedBoard: renderedGame.gameState.printedBoard,
        player1: renderedGame.gameState.player1,
        player2: renderedGame.gameState.player2,
        totalMines: renderedGame.gameState.totalMines,
        minesLeft: renderedGame.gameState.minesLeft,
        currentPlayerTurn: renderedGame.gameState.currentPlayerTurn,
      };
      renderedGame.gameState = gameState;

      response.send({
        game: renderedGame,
      });
    } catch (error) {
      response.send({
        error: error.message,
      });
    }
  };

  const getOpenTiles = (gameState, row, col, currentPlayer) => {
    // base cases
    if (
      row < 0
    || row >= gameState.board.length
    || col < 0
    || col >= gameState.board[0].length
    || gameState.board[row][col].opened === true
    ) {
      return;
    }

    if (gameState.board[row][col].opened === true) {
      return;
    }

    // number or mine
    if (gameState.board[row][col].value.trim() !== '') {
      gameState.board[row][col].opened = true;
      gameState.board[row][col].opened_by = currentPlayer.id;
      gameState.printedBoard[row][col].opened = true;
      gameState.printedBoard[row][col].opened_by = currentPlayer.id;
      gameState.printedBoard[row][col].value = gameState.board[row][col].value;
      if (gameState.board[row][col].value.trim() === '*') {
        gameState.minesLeft -= 1;
        if (currentPlayer.id === gameState.player1.id) {
          gameState.player1.flagCount += 1;
        } else if (currentPlayer.id === gameState.player2.id) {
          gameState.player2.flagCount += 1;
        }
      }
      return;
    }

    gameState.board[row][col].opened = true;
    gameState.board[row][col].opened_by = currentPlayer.id;
    gameState.printedBoard[row][col].opened = true;
    gameState.printedBoard[row][col].opened_by = currentPlayer.id;
    gameState.printedBoard[row][col].value = gameState.board[row][col].value;

    // go top
    getOpenTiles(gameState, row - 1, col, currentPlayer);
    // go bottom
    getOpenTiles(gameState, row + 1, col, currentPlayer);
    // go left
    getOpenTiles(gameState, row, col - 1, currentPlayer);
    // go right
    getOpenTiles(gameState, row, col + 1, currentPlayer);
    // go top-left
    getOpenTiles(gameState, row - 1, col - 1, currentPlayer);
    // go top-right
    getOpenTiles(gameState, row - 1, col + 1, currentPlayer);
    // go bottom-left
    getOpenTiles(gameState, row + 1, col - 1, currentPlayer);
    // go bottom-right
    getOpenTiles(gameState, row + 1, col + 1, currentPlayer);
  };

  const openRemainingTiles = (gameState) => {
    for (let rowIdx = 0; rowIdx < gameState.board.length; rowIdx += 1) {
      for (let colIdx = 0; colIdx < gameState.board[0].length; colIdx += 1) {
        gameState.board[rowIdx][colIdx].opened = true;
        gameState.printedBoard[rowIdx][colIdx].opened = true;
        gameState.printedBoard[rowIdx][colIdx].value = gameState.board[rowIdx][colIdx].value;
      }
    }
  };

  const update = async (request, response) => {
    try {
      const gameId = request.params.id;
      const rowId = Number(request.params.rowId);
      const colId = Number(request.params.colId);
      const { user } = request;

      if (!user) {
        throw new Error(globals.GAME_CANT_PLAY_USER_NOT_LOGGED_IN);
      }

      let game = await db.Game.findOne({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        throw new Error(globals.GAME_NOT_FOUND_ERROR_MESSAGE);
      }

      if (user.id !== game.gameState.currentPlayerTurn) {
        throw new Error(globals.GAME_NOT_CURRENT_TURN);
      }

      game = game.dataValues;
      const { currentPlayerTurn } = game.gameState;
      let currentPlayer = {};
      let otherPlayer = {};
      let nextPlayerTurn = -1;
      const { board } = game.gameState;

      // determine current player
      if (currentPlayerTurn === game.gameState.player1.id) {
        currentPlayer = game.gameState.player1;
        if (game.gameState.player2) {
          otherPlayer = game.gameState.player2;
        }
        nextPlayerTurn = game.gameState.player1.id;
      } else if (game.gameState.player2 && currentPlayerTurn === game.gameState.player2.id) {
        currentPlayer = game.gameState.player2;
        otherPlayer = game.gameState.player1;
        nextPlayerTurn = game.gameState.player2.id;
      }

      if (board[rowId][colId].value.trim() !== '*') {
        // update turn count
        currentPlayer.turnCount += 1;
        // change to other player if it's not practice mode
        if (game.type !== 'practice') {
          nextPlayerTurn = otherPlayer.id;
        }
      }

      getOpenTiles(game.gameState, rowId, colId, currentPlayer);

      // check win condition
      if (currentPlayer.flagCount === Math.ceil(globals.MINE_COUNT / 2)) {
        // update turn count
        currentPlayer.turnCount += 1;
        // set winner
        game.winnerUserId = currentPlayer.id;
        // set game as completed
        game.isCompleted = true;
        // remove player turn
        nextPlayerTurn = -1;
        // open remaining tiles
        openRemainingTiles(game.gameState);
      }

      const gameToUpdate = {
        ...game,
        gameState: {
          board: game.gameState.board,
          printedBoard: game.gameState.printedBoard,
          player1: (currentPlayer.id === game.createdUserId) ? currentPlayer : otherPlayer,
          player2: (currentPlayer.id === game.createdUserId) ? otherPlayer : currentPlayer,
          totalMines: game.gameState.totalMines,
          minesLeft: game.gameState.minesLeft,
          currentPlayerTurn: nextPlayerTurn,
        },
        updatedAt: new Date(),
      };

      const updatedGame = await db.Game.update(
        gameToUpdate,
        {
          where: { id: gameId },
          returning: true,
        },
      );

      const printedGame = {
        ...updatedGame[1][0].dataValues,
        gameState: {
          printedBoard: updatedGame[1][0].gameState.printedBoard,
          player1: updatedGame[1][0].gameState.player1,
          player2: updatedGame[1][0].gameState.player2,
          totalMines: updatedGame[1][0].gameState.totalMines,
          minesLeft: updatedGame[1][0].gameState.minesLeft,
          currentPlayerTurn: updatedGame[1][0].gameState.currentPlayerTurn,
        },
      };

      response.send(printedGame);
    } catch (error) {
      response.send({
        error: error.message,
        stack: error.stack,
      });
    }
  };

  const forfeit = async (request, response) => {
    try {
      const gameId = request.params.id;
      const { user } = request;

      if (!user) {
        throw new Error(globals.GAME_CANT_FORFEIT_USER_NOT_LOGGED_IN);
      }

      let game = await db.Game.findOne({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        throw new Error(globals.GAME_NOT_FOUND_ERROR_MESSAGE);
      }

      if (user.id !== game.createdUserId && user.id !== game.playerUserId) {
        throw new Error(globals.GAME_CANT_FORFEIT_USER_NOT_PLAYER);
      }

      game = game.dataValues;
      // 1 player mode, or game not joined
      if (typeof game.playerUserId !== 'number') {
        game.isCompleted = true;
      }
      // 2 player mode, where user is 2nd player
      // set winner to 1st player
      else if (user.id === game.playerUserId) {
        game.winnerUserId = game.createdUserId;
        game.isCompleted = true;
      }
      // 2 player mode, where user is 1st player
      // set winner to 2nd player
      else {
        game.winnerUserId = game.playerUserId;
        game.isCompleted = true;
      }

      // remove player turn
      const nextPlayerTurn = 0;
      // open remaining tiles
      openRemainingTiles(game.gameState);

      const gameToUpdate = {
        ...game,
        gameState: {
          board: game.gameState.board,
          printedBoard: game.gameState.printedBoard,
          player1: game.gameState.player1,
          player2: game.gameState.player2,
          totalMines: game.gameState.totalMines,
          minesLeft: game.gameState.minesLeft,
          currentPlayerTurn: nextPlayerTurn,
        },
        updatedAt: new Date(),
      };

      const updatedGame = await db.Game.update(
        gameToUpdate,
        {
          where: { id: gameId },
          returning: true,
        },
      );

      const printedGame = {
        ...updatedGame[1][0].dataValues,
        gameState: {
          printedBoard: updatedGame[1][0].gameState.printedBoard,
          player1: updatedGame[1][0].gameState.player1,
          player2: updatedGame[1][0].gameState.player2,
          totalMines: updatedGame[1][0].gameState.totalMines,
          minesLeft: updatedGame[1][0].gameState.minesLeft,
          currentPlayerTurn: updatedGame[1][0].gameState.currentPlayerTurn,
        },
      };

      response.send(printedGame);
    } catch (error) {
      response.send({
        error: error.message,
        stack: error.stack,
      });
    }
  };

  return {
    newForm,
    create,
    show,
    showAjax,
    update,
    forfeit,
  };
}
