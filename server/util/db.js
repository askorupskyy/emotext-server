const { DB_USER, DB_PASSWORD } = require('../cfg');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres',
    DB_USER || 'postgres',
    DB_PASSWORD || '',
    {
        host: DB_HOST || 'localhost',
        port: DB_PORT || 5432,
        dialect: 'postgres',
        dialectOptions: {
            ssl: process.env.DB_SSL == "true"
        }
    });

module.exports = sequelize;