export default function initLoginController(db) {
  const index = (request, response) => {
    response.render('login/index', {
      user: {}, userInfo: {}, genericSuccess: {}, genericError: {},
    });
  };

  return {
    index,
  };
}
