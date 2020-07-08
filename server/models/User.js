const sequelize = require('../util/db');
const { Sequelize, DataTypes, Model } = require('sequelize');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
    profilePictureURL: {
        type: DataTypes.STRING,
        default: '',
    },
    bio: {
        type: DataTypes.STRING,
        default: '',
    },
    isDeleted: {
        type: DataTypes.STRING,
        default: false
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        default: '',
    },
    seeRealName: {
        type: DataTypes.INTEGER,
        default: 0,
    },
    seeEmail: {
        type: DataTypes.INTEGER,
        default: 0,
    },
    textMe: {
        type: DataTypes.INTEGER,
        default: 0
    },
    // 0 - everybody
    // 1 - contacts only
    // 2 - noobody
    //many more privacy settings;
    isOnline: {
        type: DataTypes.BOOLEAN,
        default: false
    },
    lastSeen: {
        type: DataTypes.DATE,
        default: Date.now()
    }
});

module.exports = User;