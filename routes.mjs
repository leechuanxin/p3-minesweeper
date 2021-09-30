import { resolve } from 'path';
import db from './models/index.mjs';
import initItemsController from './controllers/items.mjs';
import initLoginController from './controllers/login.mjs';

export default function bindRoutes(app) {
  const ItemsController = initItemsController(db);
  const LoginController = initLoginController(db);

  app.get('/items', ItemsController.index);
  app.get('/login', LoginController.index);

  // special JS page. Include the webpack index.html file
  app.get('/home', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
}
