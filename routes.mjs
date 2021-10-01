import { resolve } from 'path';
import db from './models/index.mjs';
import initLoginController from './controllers/login.mjs';

export default function bindRoutes(app) {
  const LoginController = initLoginController(db);

  app.get('/login', LoginController.index);
  app.get('/signup', LoginController.register);

  // special JS page. Include the webpack index.html file
  app.get('/', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
}
