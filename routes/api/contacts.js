const express = require("express");
const { Op } = require("sequelize");

const User = require("../../models/User");
const UserSession = require("../../models/UserSession");
const Contact = require("../../models/Contact");
const FriendRequest = require("../../models/FriendRequest");
const UserRestrictions = require("../../models/UserRestrictions");

const router = express.Router();

router.post("/send-friend-request/", async (req, res) => {
  const { body } = req;
  const { token, friend } = body;

  const friendUser = await User.findByPk(friend);

  if (!friendUser) {
    return res.status(404).send({
      success: false,
      message: "A Person You Are Trying To Add Does Not Exist",
    });
  }

  const session = await UserSession.findByPk(token);

  if (!session) {
    return res.status(404).send({
      success: false,
      message: "Invalid Token",
    });
  }

  const fr = await FriendRequest.findOne({
    where: {
      [Op.and]: [
        {
          [Op.or]: [{ userFrom: session.userId }, { userTo: session.userId }],
          [Op.or]: [{ userFrom: friend }, { userTo: friend }],
        },
      ],
    },
  });

  if (fr) {
    return res.status(401).send({
      success: false,
      message: "A Friend Request Already Exists",
    });
  }

  const contact = await FriendRequest.findOne({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { userOneId: session.userId },
            { userTwoId: session.userId },
          ],
          [Op.or]: [{ userOneId: friend }, { userTo: friend }],
        },
      ],
    },
  });

  if (contact) {
    return res.status(401).send({
      success: false,
      message: "You Are Already Friends With This User",
    });
  }

  let restrictions = await UserRestrictions.findOne({
    where: {
      [Op.and]: [
        {
          restrictedUserID: session.userId,
          userID: friend,
        },
      ],
    },
  });

  if (restrictions.isBlocked) {
    return res.status(401).send({
      success: false,
      message: "This User Has Blocked You",
    });
  }

  let restrictions = await UserRestrictions.findOne({
    where: {
      [Op.and]: [
        {
          restrictedUserID: friend,
          userID: session.userId,
        },
      ],
    },
  });

  if (restrictions.isBlocked) {
    return res.status(401).send({
      success: false,
      message: "You Have Blocked This User",
    });
  }

  const friendRequest = await FriendRequest.create({
    userFrom: session.userId,
    userTo: friend,
  });

  return res.status(200).send({
    success: false,
    message: "Friend Request Sent",
  });
});

router.post("/ignore-friend-request/", async (req, res) => {
  const { body } = req;
  const { token, requestID } = body;

  const session = await UserSession.findByPk(token);

  if (!session) {
    return res.status(404).send({
      success: false,
      message: "Invalid Token",
    });
  }

  const fr = await FriendRequest.findByPk(requestID);

  if (!fr) {
    return res.status(404).send({
      success: false,
      message: "This Friend Request Does Not Exist",
    });
  }

  if (fr.userFrom === session.userId) {
    return res.status(401).send({
      success: false,
      message:
        "You Cannot Change The Status Of The Request Because You Are The One Who Sent It",
    });
  }

  fr.didIgnore = true;

  await fr.save();

  return res.status(200).send({
    success: true,
    message: "Friend Request Ignored",
  });
});

router.post("/decline-friend-request/", async (req, res) => {
  const { body } = req;
  const { token, requestID } = body;

  const session = await UserSession.findByPk(token);

  if (!session) {
    return res.status(404).send({
      success: false,
      message: "Invalid Token",
    });
  }

  const fr = await FriendRequest.findByPk(requestID);

  if (!fr) {
    return res.status(404).send({
      success: false,
      message: "This Friend Request Does Not Exist",
    });
  }

  if (fr.userFrom === session.userId) {
    return res.status(401).send({
      success: false,
      message:
        "You Cannot Change The Status Of The Request Because You Are The One Who Sent It",
    });
  }

  fr.didReject = true;

  await fr.save();

  return res.status(200).send({
    success: true,
    message: "Friend Request Rejected",
  });
});

router.delete("/cancel-friend-request/", async (req, res) => {
  const { body } = req;
  const { token, requestID } = body;

  const session = await UserSession.findByPk(token);

  if (!session) {
    return res.status(404).send({
      success: false,
      message: "Invalid Token",
    });
  }

  const fr = await FriendRequest.findByPk(requestID);

  if (!fr) {
    return res.status(404).send({
      success: false,
      message: "This Friend Request Does Not Exist",
    });
  }

  if (fr.userFrom !== session.userId) {
    return res.status(401).send({
      success: false,
      message:
        "You Cannot Change The Status Of The Request Because You Are Not The One Who Sent It",
    });
  }

  await fr.destroy();

  return res.status(200).send({
    success: true,
    message: "Friend Request Cancelled",
  });
});

router.post("/accept-friend-request/", async (req, res) => {
  const { body } = req;
  const { token, requestID } = body;

  const session = await UserSession.findByPk(token);

  if (!session) {
    return res.status(404).send({
      success: false,
      message: "Invalid Token",
    });
  }

  const fr = await FriendRequest.findByPk(requestID);

  if (!fr) {
    return res.status(404).send({
      success: false,
      message: "This Friend Request Does Not Exist",
    });
  }

  if (fr.userFrom === session.userId) {
    return res.status(401).send({
      success: false,
      message:
        "You Cannot Change The Status Of The Request Because You Are The One Who Sent It",
    });
  }

  fr.didAccept = true;

  await fr.save();

  const userFrom = await User.findByPk(fr.userFrom);

  const userTo = await User.findByPk(fr.userTo);

  await Contact.create({
    userOneId: fr.userFrom,
    userTwoId: session.userId,
    userOneName: userFrom.name,
    userTwoName: userTo.name,
  });

  return res.status(200).send({
    success: true,
    message: "Friend Request Accepted",
  });
});

router.put("/rename-friend/", async (req, res) => {
  const { body } = req;
  const { token, contactID, name } = body;

  const { body } = req;
  const { token, contactID } = body;

  const session = await UserSession.findByPk(token);

  if (!session) {
    return res.status(404).send({
      success: false,
      message: "Invalid Session",
    });
  }

  const contact = await Contact.findByPk(contactID);

  if (
    contact.userOneId !== session.userId &&
    contact.userTwoId !== session.userId
  ) {
  }

  if (contact.userOneId === session.userId) {
    contact.userTwoName = name;
    await contact.save();
  } else if (contact.userTwoId === session.userId) {
    contact.userOneName = name;
    await contact.save();
  } else {
    return res.status(401).send({
      success: false,
      message: "You Are Not Friends With This Person",
    });
  }

  return res.status(200).send({
    success: true,
    message: "Friend Renamed",
  });
});

router.put("/delete-friend/", async (req, res) => {
  const { body } = req;
  const { token, contactID } = body;

  const session = await UserSession.findByPk(token);

  if (!session) {
    return res.status(404).send({
      success: false,
      message: "Invalid Session",
    });
  }

  const contact = await Contact.findByPk(contactID);

  if (
    contact.userOneId !== session.userId &&
    contact.userTwoId !== session.userId
  ) {
    return res.status(401).send({
      success: false,
      message: "You Are Not Friends With This Person",
    });
  }

  await contact.destroy();

  return res.status(200).send({
    success: true,
    message: "Friend Deleted",
  });
});

module.exports = router;
