const Message = require('../../models/Message');
const Chat = require('../../models/Chat');
const Message = require('../../models/Message');

const createMessage = async (uid, chatID, text) => {
    return await Message.create({ fromId: uid, chatId: chatID, text: text });
}

const createChat = async (uid, users) => {
    //assuming users is a single user for now
    return await Chat.create({ userOne: uid, userTwo: users });
}

const loadMessages = async (chatID, part) => {
    const limit = 25;
    return await Message.findAll({
        offset: ((part - 1) * limit),
        limit: limit,
        where: { chatId: chatID }
    })
}

module.exports = { createMessage, createChat, loadMessages };