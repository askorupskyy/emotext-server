const sequelize = require('../util/db');
const { Sequelize, DataTypes, Model } = require('sequelize');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
    time: {
        type: DataTypes.DATE,
        default: Date.now(),
    },
    fromId: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        default: false,
    },
    chatId: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    }
});

module.exports = Message;