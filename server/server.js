const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const db = require('./util/db');

const authApi = require('./routes/api/auth');

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use('/api/auth/', authApi);

app.listen('5000', () => {
    console.log('Listening on port 5000');
})