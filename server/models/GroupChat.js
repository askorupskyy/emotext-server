const mongoose = require('mongoose');

const GroupChat = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    users: {
        type: [String],
        default: [""],
    },
    pictureURL: {
        type: String,
        default: "",
    },
});

module.exports = mongoose.model('GroupChat', GroupChat);