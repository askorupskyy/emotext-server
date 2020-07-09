const bcrypt = require('bcrypt');

const CHARACTERS_ALLOWED = 'abcdefghijklmnopqrstuvxyz1234567890-_'.split("");

generateLink = function (length) {
    let out = '';
    for (let i = 0; i < length; i++) {
        out += CHARACTERS_ALLOWED[Math.floor(Math.random() * CHARACTERS_ALLOWED.length)];
    }
    return out;
}

generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

validatePassword = function (password, password2) {
    return bcrypt.compareSync(password, password2);
};

module.exports = { generateLink, generateHash, validatePassword };