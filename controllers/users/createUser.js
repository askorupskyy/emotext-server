const User = require('../../models/User');
const { generateHash } = require('../../util/generateBytes');

async function createUser(email, password, name, userName) {
    password = generateHash(password);
    const user = await User.create({
        email: email,
        password: password,
        name: name,
        userName: userName,
    });
    return user;
}

module.exports = createUser;
