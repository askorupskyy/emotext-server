const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userOne: {
        type: String,
        default: '',
    },
    userTwo: {
        type: String,
        default: '',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        default: '',
    },
});

module.exports = mongoose.model('Chat', chatSchema);