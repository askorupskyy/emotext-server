const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    time: {
        type: Date,
        default: Date.now(),
    },
    fromId: {
        type: String,
        default: '',
    },
    text: {
        type: String,
        default: '',
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    deletedForMe: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Message', messageSchema);