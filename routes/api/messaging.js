const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();

const Message = require("../../models/Message");
const Chat = require("../../models/Chat");
const User = require("../../models/User");
const UserSession = require("../../models/UserSession");
const UserRestrictions = require("../../models/UserRestrictions");
const Contact = require("../../models/Contact");

router.post("/send-message/", async (req, res, next) => {
  const { body } = req;
  const { text, token, chatID, isGroupChat } = body;

  if (!text) {
    return res.status(401).send({
      success: false,
      message: "The message cannot contain no text",
    });
  }

  try {
    const session = await UserSession.findByPk(token);

    if (!session || session.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findByPk(session.userID);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid token",
      });
    }

    if (!isGroupChat) {
      const chat = await Chat.findByPk(chatID);

      if (!chat || (chat.userOne !== user.id && chat.userTwo !== user.id)) {
        return res.status(401).send({
          success: false,
          message: "Wrong chat",
        });
      }

      const userTwoID = chat.userOne === user.id ? chat.userTwo : chat.userOne;
      const userTwo = await User.findByPk(userTwoID);

      if (userTwo.textMe === 2) {
        return res.status(401).send({
          success: false,
          message: "Users privacy settings don't allow you to send messages",
        });
      }

      if (userTwo.textMe === 1) {
        const contact = await Contact.findOne({
          where: {
            [Op.or]: [
              {
                [Op.and]: [{ userOneId: user.id }, { userTwoId: userTwo.id }],
                [Op.and]: [{ userTwoId: user.id }, { userOneId: userTwo.id }],
              },
            ],
          },
        });
        if (!contact) {
          return res.status(401).send({
            success: false,
            message:
              "User's privacy settings don't allow non-contacts to text them",
          });
        }
      }

      const restrictions = await UserRestrictions.findOne({
        where: {
          [Op.or]: [
            {
              [Op.and]: [{ restrictedUserID: user.id }, { userID: userTwo.id }],
              [Op.and]: [{ userID: user.id }, { restrictedUserID: userTwo.id }],
            },
          ],
        },
      });

      if (restrictions.isBlocked) {
        res.status(401).send({
          success: false,
          message: "The user has blocked you from texting",
        });
      }
    }

    const msg = await Message.create({
      chatId: chatID,
      from: user.id,
      text: text,
      isGroupChat: isGroupChat,
    });

    if (restrictions.isMuted) {
      console.log("send no notification to the user");
    }

    return res.status(200).send({
      success: true,
      message: "Message Sent",
      msg: msg,
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.delete("/delete-message/", async (req, res) => {
  const { body } = req;
  const { token, chatID, messageID } = body;

  try {
    const session = await UserSession.findByPk(token);
    if (!session || session.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findByPk(session.userID);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid token",
      });
    }

    const chat = await Chat.findByPk(chatID);

    if (!chat || (chat.userOne !== user.id && chat.userTwo !== user.id)) {
      return res.status(401).send({
        success: false,
        message: "Wrong chat",
      });
    }

    const message = await Message.findByPk(messageID);

    await message.destroy();

    return res.status(200).send({
      success: true,
      message: "Message deleted",
    });
  }
  catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.post("/edit-message/", async (req, res) => {
  const { body } = req;
  const { token, chatID, messageID, text, isGroupChat } = body;

  if (!text) {
    return res.status(401).send({
      success: false,
      message: "Messages can't by empty",
    });
  }

  try {
    const session = await UserSession.findByPk(token);
    if (!session || session.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "Invalid tken",
      });
    }

    const user = await User.findByPk(session.userID);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid token",
      });
    }

    const chat = await Chat.findByPk(chatID);
    if (!chat || chat.users.indexOf(user.id) === -1) {
      return res.status(401).send({
        success: false,
        message: "Wrong chat",
      });
    }

    const message = await Message.findByPk(messageID);
    if (!message) {
      return res.status(404).send({
        success: false,
        message: "The message does not exist",
      });
    }

    if (message.from !== user.id) {
      return res.status(401).send({
        success: false,
        message: "Can't edit other people's messages",
      });
    }

    message.text = text;

    await message.save();

    return res.status(200).send({
      success: true,
      message: "Message edited",
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.get("/search-message/", async (req, res) => {
  const { query } = req;
  const { chatID, searchQuery, token, isGroupChat } = query;

  if (!searchQuery) {
    return res.status(404).send({
      success: false,
      message: "The query cannot be empty",
    });
  }

  try {
    const session = await UserSession.findByPk(token);
    if (!session || session.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findByPk(session.userID);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid token",
      });
    }

    if (isGroupChat) {
      const chat = await Chat.findByPk(chatID);
      if (!chat || chat.users.indexOf(user.id) === -1) {
        return res.status(401).send({
          success: false,
          message: "Wrong chat",
        });
      }
    }
    else {
      const chat = await Chat.findByPk(chatID);
      if (!chat || (chat.userOne !== user.id && chat.userTwo !== user.id)) {
        return res.status(401).send({
          success: false,
          message: "Wrong chat",
        });
      }
    }

    const messages = await Message.findAll({
      where: {
        text: {
          [Op.like]: `%${searchQuery}%`,
        },
        chatId: chatID,
        isGroupChat: isGroupChat
      },
    });

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

module.exports = router;