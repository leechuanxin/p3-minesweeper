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

  const getOpenTiles = (gameState, row, col, currentPlayerId) => {
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
      gameState.board[row][col].opened_by = currentPlayerId;
      gameState.printedBoard[row][col].opened = true;
      gameState.printedBoard[row][col].opened_by = currentPlayerId;
      gameState.printedBoard[row][col].value = gameState.board[row][col].value;
      if (gameState.board[row][col].value.trim() === '*') {
        gameState.minesLeft -= 1;
      }
      return;
    }

    gameState.board[row][col].opened = true;
    gameState.board[row][col].opened_by = currentPlayerId;
    gameState.printedBoard[row][col].opened = true;
    gameState.printedBoard[row][col].opened_by = currentPlayerId;
    gameState.printedBoard[row][col].value = gameState.board[row][col].value;

    // go top
    getOpenTiles(gameState, row - 1, col, currentPlayerId);
    // go bottom
    getOpenTiles(gameState, row + 1, col, currentPlayerId);
    // go left
    getOpenTiles(gameState, row, col - 1, currentPlayerId);
    // go right
    getOpenTiles(gameState, row, col + 1, currentPlayerId);
    // go top-left
    getOpenTiles(gameState, row - 1, col - 1, currentPlayerId);
    // go top-right
    getOpenTiles(gameState, row - 1, col + 1, currentPlayerId);
    // go bottom-left
    getOpenTiles(gameState, row + 1, col - 1, currentPlayerId);
    // go bottom-right
    getOpenTiles(gameState, row + 1, col + 1, currentPlayerId);
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
      let nextPlayerTurn = 0;
      const { board } = game.gameState;
      const { printedBoard } = game.gameState;
      const { minesLeft } = game.gameState;

      // determine current player
      if (currentPlayerTurn === game.gameState.player1.id) {
        currentPlayer = game.gameState.player1;
        otherPlayer = game.gameState.player2;
        nextPlayerTurn = game.gameState.player1.id;
      } else {
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

      getOpenTiles(game.gameState, rowId, colId, currentPlayer.id);

      const updatedGame = {
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

      const printGame = await db.Game.update(
        updatedGame,
        {
          where: { id: gameId },
          returning: true,
        },
      );

      // console.log('print game:', printGame);
      console.log('print game:', printGame[1].dataValues);
      console.log('');

      // if (board[rowIdx][colIdx].value.trim() !== '*') {
      //   updateTurnCount();
      // }

      // // open tiles
      // getOpenTiles(board, rowIdx, colIdx);
      // printBoard(board);
      response.send('success!');
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
  };
}
