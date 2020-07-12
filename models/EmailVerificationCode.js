const sequelize = require('../util/db');
const { DataTypes } = require('sequelize');

const EmailVerificationCode = sequelize.define('EmailVerificationCode', {
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

module.exports = EmailVerificationCode;