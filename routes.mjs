// import { resolve } from 'path';

// CUSTOM IMPORTS
import db from './models/index.mjs';
import initIndexController from './controllers/index.mjs';
import initLoginController from './controllers/login.mjs';
import initSignupController from './controllers/signup.mjs';
import initGamesController from './controllers/games.mjs';

export default function bindRoutes(app) {
  const IndexController = initIndexController(db);
  const LoginController = initLoginController(db);
  const SignupController = initSignupController(db);
  const GamesController = initGamesController(db);

  app.get('/', IndexController.index);
  app.get('/login', LoginController.index);
  app.post('/login', LoginController.create);
  app.delete('/logout', LoginController.destroy);
  app.get('/signup', SignupController.index);
  app.post('/signup', SignupController.create);
  app.get('/games/new', GamesController.newForm);
  app.post('/games', GamesController.create);
  app.get('/games/:id', GamesController.show);
  app.get('/games/:id/show', GamesController.showAjax);
  app.put('/games/:id/row/:rowId/col/:colId/update', GamesController.update);
  app.put('/games/:id/forfeit', GamesController.forfeit);
  app.put('/games/:id/join', GamesController.join);
  app.put('/games/:id/joinajax', GamesController.joinAjax);

  app.get('/home', (request, response) => {
    response.render('home');
  });

  // special JS page. Include the webpack index.html file
  // app.get('/home', (request, response) => {
  //   response.sendFile(resolve('dist', 'main.html'));
  // });
}
