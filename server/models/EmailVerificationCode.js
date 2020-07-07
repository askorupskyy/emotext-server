const sequelize = require('../util/db');
const { Sequelize, DataTypes, Model } = require('sequelize');

const EmailVerificationCode = sequelize.define('EmailVerificationCode', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
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

module.exports = EmailVerificationCode;