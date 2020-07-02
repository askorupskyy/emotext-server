const mongoose = require('mongoose');

const GroupChatUser = new mongoose.Schema({
    userId: {
        type: String,
        default: '',
    },
    chatId: {
        type: String,
        default: '',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    canDelete: {
        type: Boolean,
        default: false,
    },
    canKick: {
        type: Boolean,
        default: false,
    },
    canMuted: {
        type: Boolean,
        default: false,
    },
    canAddAdmins: {
        type: Boolean,
        default: false,
    },
    canAddMembers: {
        type: Boolean,
        default: true,
    },
    isMuted: {
        type: Boolean,
        default: false,
    },
    mutedFor: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('GroupChatUser', GroupChatUser);