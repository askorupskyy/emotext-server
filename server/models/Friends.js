const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
    userOneId: {
        type: String,
        default: '',
    },
    userTwoId: {
        type: String,
        default: '',
    },
    didAccept: {
        type: Boolean,
        default: false,
    },
    didBlock: {
        type: Boolean,
        default: false
    },
    didMute: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Friend', FriendSchema);