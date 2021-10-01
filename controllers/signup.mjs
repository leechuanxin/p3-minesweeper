export default function initSignupController() {
  const index = (request, response) => {
    if (request.isUserLoggedIn) {
      response.redirect('/');
    } else {
      response.render('signup/index', {
        user: {}, userInfo: {}, genericSuccess: {}, genericError: {},
      });
    }
  };

  return {
    index,
  };
}
