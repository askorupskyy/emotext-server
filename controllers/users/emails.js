const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const PasswordResetCode = require('../../models/PasswordResetCode');

async function getPasswordResetCode(code) {
    return await PasswordResetCode.findOne({ code: code });
}

async function createPasswordResetCode(code, email) {
    return await PasswordResetCode.create({ code: code, email: email });
}

module.exports = { getPasswordResetCode, createPasswordResetCode };