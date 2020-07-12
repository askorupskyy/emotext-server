const dotenv = require('dotenv').config();
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT
const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const DB_SSL = process.env.DB_SSL;

module.exports = { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_SSL, SMTP_EMAIL, SMTP_PASSWORD };