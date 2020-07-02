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
    chatId: {
        type: String,
        default: '',
    }
});

module.exports = mongoose.model('Message', messageSchema);