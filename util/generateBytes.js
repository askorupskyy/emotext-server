const bcrypt = require("bcryptjs");

const CHARACTERS_ALLOWED = "abcdefghijklmnopqrstuvxyz1234567890-_".split("");

generateLink = function (length) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out +=
      CHARACTERS_ALLOWED[Math.floor(Math.random() * CHARACTERS_ALLOWED.length)];
  }
  return out;
};

generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

validatePassword = function (inputpass, dbpass) {
  return bcrypt.compareSync(inputpass, dbpass);
};

module.exports = { generateLink, generateHash, validatePassword };
