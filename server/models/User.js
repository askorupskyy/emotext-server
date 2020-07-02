const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        default: "",
    },
    profilePictureURL: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    userName: {
        type: String,
        default: '',
    },
    seeRealName: {
        type: Number,
        default: 0,
    },
    seeEmail: {
        type: Number,
        default: 0,
    },
    textMe: {
        type: Number,
        default: 0
    },
    // 0 - everybody
    // 1 - contacts only
    // 2 - noobody
    //many more privacy settings;
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: Date.now()
    }
});

UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);