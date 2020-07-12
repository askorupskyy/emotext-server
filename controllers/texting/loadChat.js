const Chat = require('../../models/Chat');
const { findUserByID, findUserBySession } = require('../users/findUser');

const findChatByUserID = async (chatID, uid) => {
    const chat = await Chat.findOne({
        where: {
            id: chatID, $or: [
                {
                    userOne: { $eq: uid },
                },
                {
                    userTwo: {
                        $eq: uid
                    }
                }
            ]
        }
    })
    return chat;
}

const findChatByChatID = async (chatID) => {
    return await Chat.findOne({ where: { id: chatID } });
}

const findChatUsers = async (chatID) => {
    const chat = await findChatByChatID(chatID);
    const user1 = await findUserByID(chat.userOne);
    const user2 = await findUserByID(chat.userTwo);
    return [user1, user2];
}

const findUserChats = async (token) => {
    const user = await findUserBySession(token);
    return await Chat.findAll({
        where: {
            $or: [
                {
                    userOne: { $eq: user.id },
                },
                {
                    userTwo: {
                        $eq: user.id
                    }
                }
            ]
        }
    })
}

module.exports = { findChatByUserID, findChatByChatID, findChatUsers, findUserChats };