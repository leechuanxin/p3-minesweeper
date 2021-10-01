import * as validation from '../validation.mjs';
import * as util from '../util.mjs';
import * as globals from '../globals.mjs';

export default function initSignupController(db) {
  const index = (request, response) => {
    if (request.isUserLoggedIn) {
      response.redirect('/');
    } else {
      response.render('signup/index', {
        user: {}, userInfo: {}, genericSuccess: {}, genericError: {},
      });
    }
  };

  const create = async (request, response) => {
    try {
      const userInfo = request.body;
      const validatedUserInfo = validation.validateUserInfo(userInfo);
      const invalidRequests = util.getInvalidFormRequests(validatedUserInfo);
      if (invalidRequests.length > 0) {
        response.render('signup', {
          userInfo: validatedUserInfo,
          genericError: {},
        });
      } else {
      // get the hashed password as output from the SHA object
        const hashedPassword = util.getHash(validatedUserInfo.password);
        const nameFmt = validatedUserInfo.realname.split("'").join("''");
        const { username } = validatedUserInfo;
        const user = await db.User.findOne({
          where: {
            username,
          },
        });

        if (user) {
          throw new Error(globals.USERNAME_EXISTS_ERROR_MESSAGE);
        }

        await db.User.create({
          username,
          realName: nameFmt,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const successMessage = 'You have registered successfully! Please log in.';
        response.render('login', { userInfo: {}, genericSuccess: { message: successMessage }, genericError: {} });
      }
    } catch (error) {
      let errorMessage = '';
      if (error.message === globals.USERNAME_EXISTS_ERROR_MESSAGE) {
        errorMessage = 'There has been an error. Please try registering again with a proper name and password.';
      } else {
        errorMessage = error.message;
      }

      response.render('signup', { userInfo: {}, genericError: { message: errorMessage } });
    }
  };

  return {
    index,
    create,
  };
}
