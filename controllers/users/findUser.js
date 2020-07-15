const User = require("../../models/User");
const UserSession = require("../../models/UserSession");

async function findUserByEmailAndUserName(email, username) {
  return await User.findOne({ where: { email: email, userName: username } });
}

async function findUserByEmail(email) {
  return await User.findOne({ where: { email: email } });
}

async function findUserSession(token) {
  try {
    let session = await UserSession.findOne({
      where: { uuid: token, isDeleted: false },
    });
    console.log(session);
    return session;
  } catch (e) {
    console.log(e);
    return;
  }
}

async function findUserBySession(token) {
  const session = await findUserSession(token);
  return await User.findOne({ where: { uuid: session.userId } });
}

async function findUserByID(id) {
  return await User.findOne({ uuid: id });
}

module.exports = {
  findUserByEmailAndUserName,
  findUserByEmail,
  findUserSession,
  findUserBySession,
  findUserByID,
};
