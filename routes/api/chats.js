const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const Chat = require("../../models/Chat");
const UserSession = require("../../models/UserSession");
const User = require("../../models/User");
const GroupChat = require("../../models/GroupChat");
const Contact = require("../../models/Contact");
const Message = require("../../models/Message");

router.get("/load-chat/", async (req, res, next) => {
  const { query } = req;
  const { chatId, token } = query;

  try {
    const session = await UserSession.findByPk(token);
    if (!session || session.isDeleted) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findByPk(session.userId);

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }

    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).send({
        success: false,
        message: "Chat Not Found",
      });
    }

    if (!chat.userOne !== user.id || !chat.userTwo !== user.id) {
      return res.status(401).send({
        success: false,
        message: "User is not in the chat",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Users fetched",
      users: [chat.userOne, chat.userTwo],
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.post("/create-chat/", async (req, res, next) => {
  const { body } = req;
  let { userTo, token } = body;

  try {
    const session = await UserSession.findByPk(token);
    if (!session || session.isDeleted) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findByPk(session.userId);

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }

    const userTwo = await User.findByPk(userTo);

    if (!userTwo) {
      return res.status(404).send({
        success: false,
        message: "The user you want to text does not exist",
      });
    }

    let chat = await Chat.findOne({ where: { [Op.or]: [{ userOne: user.id, userTwo: userTo }, { userOne: userTo, userTwo: user.id }] } })
    if (chat) {
      return res.status(401).send({
        success: false,
        message: "You already have a chat with this user"
      })
    }

    chat = await Chat.create({ userOne: user.id, userTwo: userTo });
    return res.status(200).send({
      success: true,
      message: "Chat created",
      chat: chat,
    });

  } catch (e) {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.get("/load-messages/", async (req, res, next) => {
  const { query } = req;
  const { part, chatId, token } = query;
  const limit = 25;

  try {
    const session = await UserSession.findByPk(token);
    if (!session || session.isDeleted) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findByPk(session.userId);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }

    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).send({
        success: false,
        message: "Chat Not Found",
      });
    }

    if (!chat.userOne !== user.id || !chat.userTwo !== user.id) {
      return res.status(401).send({
        success: false,
        message: "User is not in the chat",
      });
    }

    const messages = await Message.findAll({
      offset: (part - 1) * limit,
      limit: limit,
      where: { chatId: chatId },
    });
    if (!messages) {
      return res.status(404).send({
        success: false,
        message: "Chat does not exist",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Messages found",
      messages: messages,
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.get("/load-chats/", async (req, res, next) => {
  const { query } = req;
  const { token } = query;

  try {
    const session = UserSession.findByPk(token);
    if (!session || session.isDeleted) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findByPk(token);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }

    const chats = await Chat.findAll({
      where: {
        $or: [
          {
            userOne: { $eq: user.id },
          },
          {
            userTwo: {
              $eq: user.id,
            },
          },
        ],
      },
    });

    const groupChats = await GroupChat.findAll({
      where: {
        users: { [Op.contains]: [user.id] }
      }
    })

    const allChats = [];

    for (let i = 0; i < chats.length; i++) {
      let name = "";
      let pictureURL = "";
      if (chats[i].userOne !== user.id) {
        name = await Contact.findAll({
          where: {
            [Op.or]: [{ userOneId: chats[i].userOne }, { userTwoId: chats[i].userOne }]
          }
        })
        let user = await User.findByPk(chats[i].userOne);
        pictureURL = user.profilePictureURL;
      }
      else if (chats[i].userOne === user.id) {
        name = await Contact.findAll({
          where: {
            [Op.or]: [{ userOneId: chats[i].userTwo }, { userTwoId: chats[i].userTwo }]
          }
        })
        let user = await User.findByPk(chats[i].userTwo);
        pictureURL = user.profilePictureURL;
      }

      let lastMessage = await Message.findOne({ where: { chatId: chats[i].id, isGroupChat: false }, order: [['createdAt', 'DESC']] });

      let message = { fromYou: lastMessage.fromId === user.id, isRead: lastMessage.isRead, text: lastMessage.text };

      allChats.push({ id: chats[i].id, name: name, pictureURL: pictureURL, lastMessage: { fromYou: message.fromYou, isRead: message.isRead, text: message.text } });
    }

    for (let i = 0; i < groupChats.length; i++) {
      let lastMessage = await Message.findOne({ where: { chatId: chats[i].id, isGroupChat: true }, order: [['createdAt', 'DESC']] });

      let message = { fromYou: lastMessage.fromId === user.id, isRead: lastMessage.isRead, text: lastMessage.text };

      allChats.push({ id: groupChats[i].id, name: groupChats[i].name, pictureURL: groupChats[i].pictureURL, lastMessage: { fromYou: message.fromYou, isRead: message.isRead, text: message.text } });
    }

    return res.status(200).send({
      success: true,
      message: "Chats loaded",
      chats: chats,
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

module.exports = router;
