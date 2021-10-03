import * as validation from '../validation.mjs';
import * as util from '../util.mjs';
import * as globals from '../globals.mjs';

export default function initLoginController(db) {
  const index = (request, response) => {
    if (request.isUserLoggedIn) {
      response.redirect('/');
    } else {
      response.render('login/index', {
        user: {}, userInfo: {}, genericSuccess: {}, genericError: {},
      });
    }
  };

  const create = async (request, response) => {
    const userInfo = request.body;
    const validatedLogin = validation.validateLogin(userInfo);
    try {
      const invalidRequests = util.getInvalidFormRequests(validatedLogin);
      if (invalidRequests.length > 0) {
        response.render('login', {
          userInfo: validatedLogin,
          genericSuccess: {},
          genericError: {},
        });
      } else {
        const { username } = validatedLogin;
        const user = await db.User.findOne({
          where: {
            username,
          },
        });

        if (!user) {
          // we didnt find a user with that email.
          // the error for password and user are the same.
          // don't tell the user which error they got for security reasons,
          // otherwise people can guess if a person is a user of a given service.
          throw new Error(globals.LOGIN_FAILED_ERROR_MESSAGE);
        }

        const unhashedCookieString = `${user.id}-${globals.SALT}`;
        // generate a hashed cookie string using SHA object
        const hashedCookieString = util.getHash(unhashedCookieString);
        // set the loggedIn and userId cookies in the response
        // The user's password hash matches that in the DB and we authenticate the user.
        response.cookie('loggedIn', hashedCookieString);
        response.cookie('userId', user.id);
        response.redirect('/');
      }
    } catch (error) {
      let errorMessage = '';
      if (error.message === globals.LOGIN_FAILED_ERROR_MESSAGE) {
        errorMessage = 'There has been an error. Please ensure that you have the correct name or password.';
      } else {
        errorMessage = error.message;
      }

      response.render('login', { userInfo: validatedLogin, genericSuccess: {}, genericError: { message: errorMessage } });
    }
  };

  const destroy = (request, response) => {
    if (request.isUserLoggedIn) {
      response.clearCookie('userId');
      response.clearCookie('loggedIn');
      response.redirect('/');
    } else {
      response.status(403).send('Error logging out!');
    }
  };

  return {
    index,
    create,
    destroy,
  };
}
