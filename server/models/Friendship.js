const sequelize = require('../util/db');
const { DataTypes } = require('sequelize');

const Friendship = sequelize.define('Friendship', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
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