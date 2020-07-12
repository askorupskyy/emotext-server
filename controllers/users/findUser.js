const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

async function findUserByEmailAndUserName(email, username) {
    return await User.findOne({ where: { email: email, userName: username } });
}

async function findUserByEmail(email) {
    return await User.findOne({ where: { email: email } });
}

async function findUserSession(token) {
    return await UserSession.findOne({ where: { id: token, isDeleted: false } });
}

async function findUserBySession(token) {
    const session = await findUserSession(token);
    return await User.findOne({ where: { id: session.userId } });
}

async function findUserByID(id) {
    return await User.findOne({ id: id });
}

module.exports = { findUserByEmailAndUserName, findUserByEmail, findUserSession, findUserBySession, findUserByID };