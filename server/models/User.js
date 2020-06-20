const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: "",
    },
    lastName: {
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
    profilePicturePath: {
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
    pinnedChats: {
        type: Number,
        default: 0,
    },
    allowNonContactsToText: {
        type: Boolean,
        default: false,
    },
    allowNonContactsToSeeRealName: {
        type: Boolean,
        default: false,
    },
    //many more privacy settings;
});

UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);