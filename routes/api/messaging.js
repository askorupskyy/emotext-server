const express = require("express");
const router = express.Router();

const Message = require("../../models/Message");
const Chat = require("../../models/Chat");
const User = require("../../models/User");
const UserSession = require("../../models/UserSession");

router.post("/send-message/", async (req, res, next) => {
  const { body } = req;
  const { text, token, chatID } = body;

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

  const chat = await Chat.findByPk(chatID);

  if (!chat || chat.users.indexOf(user.id) === -1) {
    return res.status(401).send({
      success: false,
      message: "Wrong Chat",
    });
  }

  if (chat.users.length === 2) {
    const userTwoID = chat.users[0] === user.id ? chat.users[1] : chat.users[0];
    const userTwo = await User.findByPk(userTwoID);
    //check if in contacts
    //if not and if textMe is not available don't allow
    //if in, but blocked then don't allow
    //if in, but muted, don't send the notification
    if (userTwo.textMe === 2) {
      return res.status(401).send({
        success: false,
        message: "Users Privacy Settings Don't Allow You To Send Messages",
      });
    }
  }

  await Message.create({
    chatId: chatID,
    from: user.id,
    text: text,
  });

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
