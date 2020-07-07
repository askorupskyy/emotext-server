const sequelize = require('../util/db');
const { Sequelize, DataTypes, Model } = require('sequelize');

const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
    userOne: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
    userTwo: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
});

module.exports = Chat