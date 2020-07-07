const sequelize = require('../util/db');
const { Sequelize, DataTypes, Model } = require('sequelize');

const UserSession = sequelize.define('UserSession', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
    timestamp: {
        type: DataTypes.DATE,
        default: Date.now(),
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        default: false,
    },
});

module.exports = UserSession;