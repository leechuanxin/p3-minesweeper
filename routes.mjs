import { resolve } from 'path';
import initLoginController from './controllers/login.mjs';
import initSignupController from './controllers/signup.mjs';

export default function bindRoutes(app) {
  const LoginController = initLoginController();
  const SignupController = initSignupController();

  app.get('/login', LoginController.index);
  app.get('/signup', SignupController.index);

  // special JS page. Include the webpack index.html file
  app.get('/', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
}
