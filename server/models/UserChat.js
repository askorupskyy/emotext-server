const mongoose = require('mongoose');

const UserChatSchema = mongoose.Schema({
    pinnedPosition: {
        type: Number,
        min: -1,
        max: 4,
        default: -1,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    isMuted: {
        type: Boolean,
        default: false,
    },
    chatId: {
        type: Number,
        default: 0,
    }
});

module.export = mongoose.model('UserChat', UserChatSchema);