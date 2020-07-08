const sequelize = require('../util/db');
const { Sequelize, DataTypes, Model } = require('sequelize');

const PasswordResetCode = sequelize.define('PassowrdResetCode', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
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

module.exports = PasswordResetCode;