const sequelize = require('../util/db');
const { Sequelize, DataTypes, Model } = require('sequelize');

const PasswordResetCode = sequelize.define('PassowrdResetCode', {
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
    date: {
        type: DataTypes.DATE,
        default: Date.now(),
    }
});

module.exports = PasswordResetCode;