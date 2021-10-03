export default function initIndexController() {
  const index = (request, response) => {
    response.render('index/index', { user: request.user });
  };

  return {
    index,
  };
}
