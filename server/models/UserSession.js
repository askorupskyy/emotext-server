const sequelize = require('../util/db');
const { Sequelize, DataTypes, Model } = require('sequelize');

const UserSession = sequelize.define('UserSession', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
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