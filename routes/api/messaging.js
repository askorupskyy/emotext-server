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
      message: "The Message Cannot Contain No Text",
    });
  }

  const session = await UserSession.findByPk(token);

  if (!session || session.isDeleted) {
    return res.status(404).send({
      success: false,
      message: "Invalid Token",
    });
  }

  const user = await User.findByPk(session.userID);

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "Invalid Token",
    });
  }

  if (!isGroupChat) {
    const chat = await Chat.findByPk(chatID);

    if (!chat || (chat.userOne !== user.id && chat.userTwo !== user.id)) {
      return res.status(401).send({
        success: false,
        message: "Wrong Chat",
      });
    }

    const userTwoID = chat.userOne === user.id ? chat.userTwo : chat.userOne;
    const userTwo = await User.findByPk(userTwoID);

    if (userTwo.textMe === 2) {
      return res.status(401).send({
        success: false,
        message: "Users Privacy Settings Don't Allow You To Send Messages",
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
            "users Privacy Settings Don't Allow Non-Contacts To Text Them",
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
        message: "The User Has Blocked You From Texting",
      });
    }
  }

  await Message.create({
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
  });
});

router.delete("/delete-message/", async (req, res) => {
  const { body } = req;
  const { token, chatID, messageID } = body;

  const session = await UserSession.findByPk(token);

  if (!session || session.isDeleted) {
    return res.status(404).send({
      success: false,
      message: "Invalid Token",
    });
  }

  const user = await User.findByPk(session.userID);

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "Invalid Token",
    });
  }

  const chat = await Chat.findByPk(chatID);

  if (!chat || chat.users.indexOf(user.id) === -1) {
    return res.status(401).send({
      success: false,
      message: "Wrong Chat",
    });
  }

  const message = await Message.findByPk(messageID);

  if (!message) {
    return res.status(404).send({
      success: false,
      message: "The Message Does Not Exist",
    });
  }

  if (message.from !== user.id) {
    return res.status(401).send({
      success: false,
      message: "Can't Delete Other People's Messages",
    });
  }

  await message.destroy();

  return res.status(200).send({
    success: true,
    message: "Message Deleted",
  });
});

router.put("/edit-message/", async (req, res) => {
  const { body } = req;
  const { token, chatID, messageID, text } = body;

  if (!text) {
    return res.status(401).send({
      success: false,
      message: "Messages Can't By Empty",
    });
  }

  const session = await UserSession.findByPk(token);

  if (!session || session.isDeleted) {
    return res.status(404).send({
      success: false,
      message: "Invalid Token",
    });
  }

  const user = await User.findByPk(session.userID);

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "Invalid Token",
    });
  }

  const chat = await Chat.findByPk(chatID);

  if (!chat || chat.users.indexOf(user.id) === -1) {
    return res.status(401).send({
      success: false,
      message: "Wrong Chat",
    });
  }

  const message = await Message.findByPk(messageID);

  if (!message) {
    return res.status(404).send({
      success: false,
      message: "The Message Does Not Exist",
    });
  }

  if (message.from !== user.id) {
    return res.status(401).send({
      success: false,
      message: "Can't Edit Other People's Messages",
    });
  }

  message.text = text;

  await message.save();

  return res.status(200).send({
    success: true,
    message: "Message Edited",
  });
});

router.get("/search-message/", async (req, res) => {
  const { query } = req;
  const { chatID, searchQuery, token } = query;

  if (!searchQuery) {
    return res.status(404).send({
      success: false,
      message: "The Query Cannot Be Empty",
    });
  }

  const session = await UserSession.findByPk(token);

  if (!session || session.isDeleted) {
    return res.status(404).send({
      success: false,
      message: "Invalid Token",
    });
  }

  const user = await User.findByPk(session.userID);

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "Invalid Token",
    });
  }

  const chat = await Chat.findByPk(chatID);

  if (!chat || chat.users.indexOf(user.id) === -1) {
    return res.status(401).send({
      success: false,
      message: "Wrong Chat",
    });
  }

  const messages = await Message.findAll({
    where: {
      text: {
        [Op.like]: `%${searchQuery}%`,
      },
    },
  });

  return res.status(200).send({
    success: true,
    message: "Messages Found",
    messages: messages,
  });
});