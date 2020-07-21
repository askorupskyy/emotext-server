const { DB_HOST, DB_PORT, DB_SSL, DB_USER, DB_PASSWORD } = require('../cfg');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('messaging-app',
  DB_USER || 'postgres',
  DB_PASSWORD || 'postgres',
  {
    host: DB_HOST || 'localhost',
    port: DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: DB_SSL == 'true'
    },
    logging: false,
  });

module.exports = sequelize;