const express = require('express');
const router = express.Router();

const { findUserBySession } = require('../../controllers/users/findUser');
const { findChatByUserID, findChatByChatID, findChatUsers } = require('../../controllers/texting/loadChat');
const createMessage = require('../../controllers/texting/messaging');
const { loadMessages } = require('../../controllers/texting/messaging');

router.post('/send-message/', async (req, res, next) => {
    const { body } = req;
    const { text, time, token, chatId } = body;

    try {
        const user = await findUserBySession(token);
        if (!user) {
            return res.status(401).send({
                success: false,
                message: 'Invalid Token',
            });
        }
        try {
            const chat = await findChatByUserID(user.id);
            if (!chat) {
                return res.status(404).send({
                    success: false,
                    message: 'The Chat Does Not Exist'
                });
            }
            try {
                const message = await createMessage(user.id, chat.id, text);
                return res.status(200).send({
                    success: true,
                    message: 'Message Sent!',
                    data: message,
                })
            }
            catch (e) {
                return res.status(500).send({
                    success: false,
                    message: 'Server Error'
                })
            }
        }
        catch (e) {
            return res.status(500).send({
                success: false,
                message: 'Server Error',
            })
        }
    }
    catch (e) {
        return res.status(500).send({
            success: false,
            message: 'Server Error',
        })
    }
});

router.get('/load-chat/', async (req, res, next) => {
    const { query } = req;
    const { chatId } = query;
    try {
        const chat = await findChatByChatID(chatId);
        if (!chat) {
            return res.status(404).send({
                success: false,
                message: 'Chat Not Found',
            })
        }
        try {
            const users = await findChatUsers(chatId);
            if (!users) {
                return res.status(404).send({
                    success: false,
                    message: 'No Users Found'
                })
            }
            return res.status(200).send({
                success: true,
                message: 'Fetched Users',
                users: users,
            })
        }
        catch (e) {
            return res.status(500).send({
                success: false,
                message: 'Server Error',
            });
        }
    }
    catch (e) {
        return res.status(500).send({
            success: false,
            message: 'Server Error',
        })
    }
});

router.post('/create-chat/', async (req, res, next) => {
    const { body } = req;
    let { userTo, token } = body;
    try {
        const user = await findUserBySession(token);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User Not Found',
            })
        }
        try {
            const chat = await createChat(user.id, userTo);
            return res.status(200).send({
                success: true,
                message: 'Chat Created',
                chat: chat,
            })
        }
        catch (e) {
            return res.status(500).send({
                success: false,
                message: 'Server Error',
            })
        }
    }
    catch (e) {
        return res.status(500).send({
            success: false,
            message: 'Server Error',
        })
    }
});

router.get('/load-messages/', async (req, res, next) => {
    const { query } = req;
    const { part, chatId } = query;
    try {
        const messages = await loadMessages(chatId, part);
        if (!messages) {
            return res.status(404).send({
                success: false,
                message: 'Chat Does Not Exist',
            })
        }
        return res.status(200).send({
            success: true,
            message: 'Messages Found',
            messages: messages,
        })
    }
    catch (e) {
        return res.status(500).send({
            success: false,
            message: 'Server Error',
        })
    }
});

router.get('/load-chats/', async (req, res, next) => {
    const { query } = req;
    const { token } = query;

    try {
        const chats = await findUserChats(token);
        return res.status(202).send({
            success: true,
            message: 'Chats Loaded',
            chats: chats,
        })
    }
    catch (e) {
        return res.status(500).send({
            success: false,
            message: 'Server Error',
        })
    }
});

module.exports = router;