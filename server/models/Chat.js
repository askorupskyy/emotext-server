const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    users: {
        type: [String],
        default: [],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    link: {
        type: String,
        default: '',
    },
});

module.exports = mongoose.model('Chat', chatSchema);