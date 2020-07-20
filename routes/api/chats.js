const express = require("express");
const router = express.Router();

const Chat = require("../../models/Chat");
const UserSession = require("../../models/UserSession");
const User = require("../../models/User");

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

    const chat = await Chat.create({ userOne: user.id, userTwo: userTo });
    return res.status(200).send({
      success: true,
      message: "Chat created",
      chat: chat,
    });
  } catch {
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
