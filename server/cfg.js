const dotenv = require('dotenv').config();
const HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USERNAME || "test";
const DB_PASSWORD = process.env.DB_PASSWORD || "tester";
const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

module.exports = { HOST, DB_USER, DB_PASSWORD, SMTP_EMAIL, SMTP_PASSWORD };