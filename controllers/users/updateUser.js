const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const { findUserBySession } = require('./findUser');

async function setSessionDeleted(token) {
    const session = await UserSession.findOne({ where: { id: token, isDeleted: false } });
    return await session.update({ isDeleted: true });
}

async function setProfilePicture(token, pictureURL) {
    const session = await UserSession.findOne({ where: { id: token, isDeleted: false } });
    const user = await User.findOne({ where: { id: session.id } });
    return await user.update({ profilePictureURL: pictureURL });
}

async function updatePrivacySettings(token, settings) {
    const user = await findUserBySession(token);
    return await user.update(settings);
}

module.exports = { setSessionDeleted, setProfilePicture, updatePrivacySettings };