const mongoose = require('mongoose');
const { DB_USER, DB_PASSWORD } = require('../cfg');
const url = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0-dqmky.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', (err) => {
    throw err;
});

db.on('open', () => {
    console.log('Connection Successfull');
})

module.exports = db;