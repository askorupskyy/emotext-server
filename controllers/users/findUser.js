const User = require("../../models/User");
const UserSession = require("../../models/UserSession");

async function findUserByEmailAndUserName(email, username) {
  return await User.findOne({ where: { email: email, userName: username } });
}

async function findUserByEmail(email) {
  return await User.findOne({ where: { email: email } });
}

async function findUserSession(token) {
  let session = await UserSession.findByPk(token);
  if (session.isDeleted === true) return null;
  return session;
}

async function findUserBySession(token) {
  const session = await findUserSession(token);
  return await User.findByPk(session.userId);
}

async function findUserByID(id) {
  return await User.findByPk(id);
}

module.exports = {
  findUserByEmailAndUserName,
  findUserByEmail,
  findUserSession,
  findUserBySession,
  findUserByID,
};
