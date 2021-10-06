import { Sequelize } from 'sequelize';
import url from 'url';
import allConfig from '../config/config.js';

import userModel from './user.mjs';
import gameModel from './game.mjs';

const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};
let sequelize;

// If env is production, retrieve database auth details from the
// DATABASE_URL env var that Heroku provides us
if (env === 'production') {
  // Break apart the Heroku database url and rebuild the configs we need
  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(':'));
  const password = dbUrl.auth.substr(dbUrl.auth.indexOf(':') + 1, dbUrl.auth.length);
  const dbName = dbUrl.path.slice(1);
  const host = dbUrl.hostname;
  const { port } = dbUrl;
  config.host = host;
  config.port = port;
  sequelize = new Sequelize(dbName, username, password, config);
}

// If env is not production, retrieve DB auth details from the config
else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.User = userModel(sequelize, Sequelize.DataTypes);
db.Game = gameModel(sequelize, Sequelize.DataTypes);

// creates a method in the
// user object with getCreatedGames, etc.
// allows the use of include with createdGames
db.User.hasMany(db.Game, {
  as: 'createdGames',
  foreignKey: 'createdUserId',
});

db.User.hasMany(db.Game, {
  as: 'playedGames',
  foreignKey: 'playerUserId',
});

db.User.hasMany(db.Game, {
  as: 'wonGames',
  foreignKey: 'winnerUserId',
});

// creates a method in the
// game object that has a user - the creator of the game
db.Game.belongsTo(db.User, {
  as: 'creator',
  foreignKey: 'createdUserId',
});

db.Game.belongsTo(db.User, {
  as: 'player',
  foreignKey: 'playerUserId',
});

db.Game.belongsTo(db.User, {
  as: 'winner',
  foreignKey: 'winnerUserId',
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
