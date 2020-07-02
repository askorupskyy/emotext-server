const mongoose = require("mongoose");

const EmailVerificationCode = new mongoose.Schema({
    code: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        default: "",
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('EmailVerificationCode', EmailVerificationCode);