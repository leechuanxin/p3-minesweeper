export default function initLoginController() {
  const index = (request, response) => {
    if (request.isUserLoggedIn) {
      response.redirect('/');
    } else {
      response.render('login/index', {
        user: {}, userInfo: {}, genericSuccess: {}, genericError: {},
      });
    }
  };

  const register = (request, response) => {
    if (request.isUserLoggedIn) {
      response.redirect('/');
    } else {
      response.render('login/signup', {
        user: {}, userInfo: {}, genericSuccess: {}, genericError: {},
      });
    }
  };

  return {
    index,
    register,
  };
}
