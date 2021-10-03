export default function initGamesController() {
  const newForm = (request, response) => {
    if (!request.isUserLoggedIn) {
      response.redirect('/login');
    } else {
      response.render('games/newForm', { user: request.user, game: {} });
    }
  };

  return {
    newForm,
  };
}
