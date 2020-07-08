const sequelize = require('../util/db');
const { Sequelize, DataTypes, Model } = require('sequelize');

const Friendship = sequelize.define('Friendship', {
    userOneId: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
    userTwoId: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
    didAccept: {
        type: DataTypes.BOOLEAN,
        default: false,
    },
    didBlock: {
        type: DataTypes.BOOLEAN,
        default: false
    },
    didMute: {
        type: DataTypes.BOOLEAN,
        default: false,
    },
});

module.exports = Friendship;