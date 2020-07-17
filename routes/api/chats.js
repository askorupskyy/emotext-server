const express = require("express");
const router = express.Router();

const Chat = require("../../models/Chat");
const UserSession = require("../../models/UserSession");
const User = require("../../models/User");

router.get("/load-chat/", async (req, res, next) => {
  const { query } = req;
  const { chatId } = query;

  const chat = await Chat.findByPk(chatId);
  if (!chat) {
    return res.status(404).send({
      success: false,
      message: "Chat Not Found",
    });
  }

  return res.status(200).send({
    success: true,
    message: "Fetched Users",
    users: [chat.userOne, chat.userTwo],
  });
});

router.post("/create-chat/", async (req, res, next) => {
  const { body } = req;
  let { userTo, token } = body;
  const user = await UserSession.findByPk(token);
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User Not Found",
    });
  }
  const chat = await Chat.create({ userOne: user.id, userTwo: userTo });
  return res.status(200).send({
    success: true,
    message: "Chat Created",
    chat: chat,
  });
});

router.get("/load-messages/", async (req, res, next) => {
  const { query } = req;
  const { part, chatId } = query;
  const limit = 25;
  const messages = await Message.findAll({
    offset: (part - 1) * limit,
    limit: limit,
    where: { chatId: chatId },
  });
  if (!messages) {
    return res.status(404).send({
      success: false,
      message: "Chat Does Not Exist",
    });
  }
  return res.status(200).send({
    success: true,
    message: "Messages Found",
    messages: messages,
  });
});

router.get("/load-chats/", async (req, res, next) => {
  const { query } = req;
  const { token } = query;

  const session = UserSession.findByPk(token);

  if (!session || session.isDeleted) {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }

  const user = await User.findByPk(token);

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "Invalid token",
    });
  }

  chats = await Chat.findAll({
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

  return res.status(200).send({
    success: true,
    message: "Chats Loaded",
    chats: chats,
  });
});

module.exports = router;
