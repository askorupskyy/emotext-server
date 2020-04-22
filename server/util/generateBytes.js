const CHARACTERS_ALLOWED = 'abcdefghijklmnopqrstuvxyz1234567890-_'.split("");

function generateLink(length) {

    let out = '';

    for (let i = 0; i < length; i++) {
        out += CHARACTERS_ALLOWED[Math.floor(Math.random() * CHARACTERS_ALLOWED.length)];
    }

    return out;
}

module.exports = generateLink;