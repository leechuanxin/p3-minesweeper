// CUSTOM IMPORTS
import * as util from './util.mjs';
import * as globals from './globals.mjs';

const auth = (db) => async (request, response, next) => {
  // set the default value
  request.isUserLoggedIn = false;

  // check to see if the cookies you need exists
  if (request.cookies.loggedIn && request.cookies.userId) {
    // create an unhashed cookie string based on user ID and salt
    const unhashedCookieString = `${request.cookies.userId}-${globals.SALT}`;
    // get the hashed value that should be inside the cookie
    const hash = util.getHash(unhashedCookieString);

    // test the value of the cookie
    if (request.cookies.loggedIn === hash) {
      request.isUserLoggedIn = true;

      // look for this user in the database
      const user = await db.User.findOne({
        where: {
          id: request.cookies.userId,
        },
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        response.clearCookie('userId');
        response.clearCookie('loggedIn');
        const errorMessage = 'Your session has expired! Please try logging in again.';
        response.render('login/index', { userInfo: {}, genericSuccess: {}, genericError: { message: errorMessage } });
        return;
      }

      // set the user as a key in the request object so that it's accessible in the route
      request.user = user.dataValues;

      let currentGame = await db.Game.findOne({
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
        currentGame = {
          ...currentGame.dataValues,
        };

        currentGame = {
          ...currentGame,
          gameState: {
            printedBoard: currentGame.gameState.printedBoard,
            player1: currentGame.gameState.player1,
            player2: currentGame.gameState.player2,
            totalMines: currentGame.gameState.totalMines,
            minesLeft: currentGame.gameState.minesLeft,
            currentPlayerTurn: currentGame.gameState.currentPlayerTurn,
          },
        };
      }

      request.user.game = currentGame;

      next();

      // make sure we don't get down to the next() below
      return;
    }

    response.clearCookie('userId');
    response.clearCookie('loggedIn');
    const errorMessage = 'Your session has expired! Please try logging in again.';
    response.render('login/index', { userInfo: {}, genericSuccess: {}, genericError: { message: errorMessage } });
    return;
  }

  next();
};

export default auth;
