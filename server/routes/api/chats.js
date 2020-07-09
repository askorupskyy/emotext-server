const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Message = require('../../models/Message');
const UserSession = require('../../models/UserSession');
const Chat = require('../../models/Chat');
const generateLink = require('../../util/generateBytes');

router.post('/send-message/', (req, res, next) => {
    const { body } = req;
    const { text, time, token, chatId } = body;
    UserSession.find({ _id: token, isDeleted: false }, (err, sessions) => {
        if (err) {
            return res.send({
                success: false,
                message: `Server Error: ${err}`,
            });
        }
        if (!sessions) {
            return res.send({
                success: false,
                message: 'No sessions found.',
            });
        }
        User.findOne({ _id: sessions[0].userId }, (err, user) => {
            if (err) {
                return res.send({
                    success: false,
                    message: `Server Error: ${err}`,
                });
            }
            Chat.findOne({
                _id: chatId, $or: [
                    { 'userOne': user._id }, { 'userTwo': user._id }
                ]
            }, (err, chat) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Chat Not Found'
                    });
                }
                else {
                    let message = new Message();
                    message.fromId = user._id;
                    message.text = text;
                    message.time = time;
                    message.chatId = chat._id;
                    message.save((err, doc) => {
                        if (err) {
                            return res.send({
                                success: false,
                                message: 'Server Error',
                            });
                        }
                        else {
                            return res.send({
                                success: true,
                                message: 'Message Sent!',
                            });
                        }
                    })
                }
            });
        })
    });
});

router.get('/load-chat/', (req, res, next) => {
    const { query } = req;
    const { chatId } = query;
    Chat.findOne({ _id: chatId }, (err, chat) => {
        if (err || chat.isDeleted) {
            return res.send({
                success: false,
                message: 'Chat Could Not Be Found!',
            })
        }
        else {
            User.findOne({ _id: chat.userOne }, (err, user1) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Server Error',
                    })
                }
                else {
                    User.findOne({ _id: chat.userTwo }, (err, user2) => {
                        if (err) {
                            return res.send({
                                success: false,
                                message: 'Server Error',
                            })
                        }
                        else {
                            return res.send({
                                success: true,
                                message: 'Chat Loaded',
                                name: chat.name,
                                userOne: user1,
                                userTwo: user2,
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post('/create-chat/', (req, res, next) => {
    const { body } = req;
    let { userTo, token } = body;
    UserSession.findOne({ _id: token, isDeleted: false }, (err, session) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Invalid User.',
            });
        }
        else {
            User.findOne({ _id: session.userId }, (err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Invalid User.'
                    });
                }
                else {
                    let c = new Chat();
                    c.userOne = user._id;
                    c.userTwo = userTo._id
                    c.save((err, doc) => {
                        if (err) {
                            return res.send({
                                success: false,
                                message: 'Server Error.'
                            });
                        }
                        else {
                            return res.send({
                                success: true,
                                message: 'Chat Created!',
                            })
                        }
                    })
                }
            });
        }
    });
});

router.get('/load-messages/', (req, res, next) => {
    const { query } = req;
    const { part, chatId } = query;
    Message.find({ chatId: chatId }).skip(part > 0 ? part - 1 * 25 : 0).limit(25).then((err, msgs) => {
        if (err) {
            return res.send({
                success: false,
                message: err,
            });
        }
        else {
            return res.send({
                success: true,
                message: 'Messages Fetched!',
                messages: msgs,
            });
        };
    });
});

router.get('/load-chats/', (req, res, next) => {
    const { query } = req;
    const { token } = query;
    UserSession.findOne({ isDeleted: false, _id: token }, (err, session) => {
        if (err) {
            return res.send({
                success: false,
                message: err,
            });
        }
        else {
            User.findOne({ _id: session.userId }, (err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: err,
                    });
                }
                else {
                    Chat.find({
                        $or: [
                            { 'userOne': user._id }, { 'userTwo': user._id }
                        ]
                    }, (err, chats) => {
                        if (err) {
                            return res.send({
                                success: false,
                                message: err,
                            });
                        }
                        else {
                            return res.send({
                                success: true,
                                message: 'Chats Fetched!',
                                chats: chats,
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;