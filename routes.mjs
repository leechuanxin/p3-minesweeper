import { resolve } from 'path';

// CUSTOM IMPORTS
import db from './models/index.mjs';
import initIndexController from './controllers/index.mjs';
import initLoginController from './controllers/login.mjs';
import initSignupController from './controllers/signup.mjs';

export default function bindRoutes(app) {
  const IndexController = initIndexController(db);
  const LoginController = initLoginController(db);
  const SignupController = initSignupController(db);

  app.get('/', IndexController.index);
  app.get('/login', LoginController.index);
  app.post('/login', LoginController.create);
  app.get('/signup', SignupController.index);
  app.post('/signup', SignupController.create);

  // special JS page. Include the webpack index.html file
  app.get('/home', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
}
