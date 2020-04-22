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
    imageSource: {
        type: String,
        default: '',
    },
    videoSource: {
        type: String,
        default: '',
    },
    audioMessageSource: {
        type: String,
        default: '',
    },
    poll: {
        type: Number,
        default: 0,
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