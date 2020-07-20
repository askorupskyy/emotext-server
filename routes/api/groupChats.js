const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();

const GroupChat = require("../../models/GroupChat");
const User = require("../../models/User");
const UserSession = require("../../models/UserSession");
const Contact = require("../../models/Contact");
const Chat = require("../../models/GroupChat");
const UserRestrictions = require("../../models/UserRestrictions");

router.post("/create-chat/", async (req, res) => {
  const { body } = req;
  const { token, users, name } = body;

  let conflictingUsers = [];

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
      return res.status(404).send({
        success: false,
        message: "Invalid token",
      });
    }

    users.forEach(async (usr) => {
      const contact = await Contact.findOne({
        where: {
          [Op.or]: [
            {
              [Op.and]: [{ userOneId: user.id, userTwoId: usr }],
              [Op.and]: [{ usertwoId: user.id, userOneId: usr }],
            },
          ],
        },
      });
      if (!contact) {
        conflictingUsers.push({ user: usr, message: "Not In Contacts" });
      } else {
        const restrictions = await UserRestrictions.findOne({
          where: {
            [Op.or]: [
              {
                [Op.and]: [{ restrictedUserID: user.id }, { userID: usr }],
                [Op.and]: [{ userID: user.id }, { restrictedUserID: usr }],
              },
            ],
          },
        });
        if (restrictions) {
          conflictingUsers.push({ user: usr, message: "Blocked" });
        }
      }
    });

    if (!conflictingUsers.length === 0) {
      await GroupChat.create({
        creator: user.id,
        users: users,
        name: name,
      });
      return res.status(200).send({
        success: true,
        message: "Chat Created",
      });
    }

    return res.status(401).send({
      success: false,
      message: "Can't add some users",
      conflictingUsers: conflictingUsers,
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.get("/load-users/", async (req, res) => {
  const { query } = req;
  const { chatID, token, part } = query;

  const usersPerPart = 25;

  try {
    const session = await UserSession.findByPk(token);
    if (!session || session.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findByPk(session.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid token",
      });
    }

    const chat = await GroupChat.findByPk(chatID);
    if (!chat) {
      return res.status(404).send({
        success: false,
        message: "Chat doesn't exist",
      });
    }

    if (chat.users.indexOf(user.id) === -1) {
      return res.status(401).send({
        success: false,
        message: "You are not a part of the chat",
      });
    }

    const users = [];
    let usersPart = chat.users;
    usersPart.slice(part - 1 * usersPerPart, part * usersPerPart);
    usersPart.forEach(async (usr) => {
      if (usr !== user.id) {
        let chatUser = await User.findByPk(usr);
        let contact = await Contact.findOne({
          where: {
            [Op.or]: [
              {
                [Op.and]: [{ userOneId: user.id, userTwoId: usr }],
                [Op.and]: [{ usertwoId: user.id, userOneId: usr }],
              },
            ],
          },
        });
        if (contact) {
          chatUser.name =
            contact.userOneId === usr
              ? contact.userOneName
              : contact.userTwoName;
        }
        users.push(chatUser);
      }
    });

    return res.status(200).send({
      success: true,
      message: "Users uetched",
      users: users,
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.post("/add-user/", async (req, res) => {
  const { body } = req;
  const { token, userID, chatID } = body;

  try {
    const chat = await Chat.findByPk(chatID);
    if (!chat) {
      return res.status(404).send({
        success: false,
        message: "Chat doesn't exist",
      });
    }

    const session = await UserSession.findByPk(token);
    if (!session || session.isDeleted) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findByPk(session.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid token",
      });
    }

    if (chat.creator !== user.id || chat.admins.indexOf(user.id) === -1) {
      return res.status(401).send({
        success: false,
        message: "Only admins can add users",
      });
    }

    const restrictions = await UserRestrictions.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ restrictedUserID: user.id }, { userID: userID }],
            [Op.and]: [{ userID: user.id }, { restrictedUserID: userID }],
          },
        ],
      },
    });
    if (restrictions) {
      return res.status(401).send({
        success: false,
        message: "The user has blocked you",
      });
    }

    chat.users.add(userID);

    await chat.save();

    return res.status(200).send({
      success: true,
      message: "User added",
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.delete("/delete-user/", async (req, res) => {
  const { body } = req;
  const { token, userID, chatID } = body;

  try {
    const chat = await Chat.findByPk(chatID);
    if (!chat) {
      return res.status(404).send({
        success: false,
        message: "Chat doesn't exist",
      });
    }

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

    if (chat.creator !== user.id || chat.admins.indexOf(user.id) === -1) {
      return res.status(401).send({
        success: false,
        message: "Only admins can delete users",
      });
    }

    chat.users.splice(chat.users.indexOf(userID), 1);

    await chat.save();

    return res.status(200).send({
      success: true,
      message: "User deleted",
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.put("/rename-group/", async (req, res) => {
  const { body } = req;
  const { token, name, chatID } = body;

  try {
    const chat = await Chat.findByPk(chatID);
    if (!chat) {
      return res.status(404).send({
        success: false,
        message: "Chat doesn't exist",
      });
    }

    const session = await UserSession.findByPk(token);
    if (!session || session.isDeleted) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findByPk(session.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid token",
      });
    }

    if (chat.creator !== user.id || chat.admins.indexOf(user.id) === -1) {
      return res.status(401).send({
        success: false,
        message: "Only admins can rename the chat",
      });
    }

    chat.name = name;

    await chat.save();

    return res.status(200).send({
      success: false,
      message: "Name updated",
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.put("/change-chat-picture/", async (req, res) => {
  const { body } = req;
  const { token, picture, chatID } = body;

  return res.status(500).send({
    success: false,
    message: "Can't do that yet",
  });

  //verify that the chat exists;

  //verify the user by the token;

  //verify that the user is an admin or a creator;

  //verify that the user that's about to be removed is in the chat;

  //change the picture
});

module.exports = router;
