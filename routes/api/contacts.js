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

  try {
    const friendUser = await User.findByPk(friend);
    if (!friendUser) {
      return res.status(404).send({
        success: false,
        message: "A person you are trying to add does not exist",
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

    const fr = await FriendRequest.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ userFrom: session.userId }, { userTo: friend }],
            [Op.and]: [{ userFrom: friend }, { userTo: session.userId }],
          },
        ],
        didReject: false,
      },
    });

    if (fr) {
      return res.status(401).send({
        success: false,
        message: "A friend request aready exists",
      });
    }

    const contact = await Contact.findOne({
      where: {
        [Op.or]: [{
          userOneId: user.id,
          userTwoId: friend,
        },
        {
          userOneId: friend,
          userTwoId: user.id,
        }]
      }
    })

    if (contact) {
      return res.status(401).send({
        success: false,
        message: "You are already friends with this user",
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

    if (restrictions && restrictions.isBlocked) {
      return res.status(401).send({
        success: false,
        message: "This user has blocked you",
      });
    }

    restrictions = await UserRestrictions.findOne({
      where: {
        [Op.and]: [
          {
            restrictedUserID: friend,
            userID: session.userId,
          },
        ],
      },
    });

    if (restrictions && restrictions.isBlocked) {
      return res.status(401).send({
        success: false,
        message: "You have blocked this user",
      });
    }

    await FriendRequest.create({
      userFrom: session.userId,
      userTo: friend,
    });

    return res.status(200).send({
      success: true,
      message: "Friend request sent",
    });
  } catch (e) {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.post("/ignore-friend-request/", async (req, res) => {
  const { body } = req;
  const { token, requestID } = body;

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

    const fr = await FriendRequest.findByPk(requestID);

    if (!fr) {
      return res.status(404).send({
        success: false,
        message: "This friend request does not exist",
      });
    }

    if (fr.userFrom === session.userId) {
      return res.status(401).send({
        success: false,
        message:
          "You cannot change the status of the request because you are the one who sent it",
      });
    }

    fr.didIgnore = true;

    await fr.save();

    return res.status(200).send({
      success: true,
      message: "Friend Request Ignored",
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.post("/decline-friend-request/", async (req, res) => {
  const { body } = req;
  const { token, requestID } = body;

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

    const fr = await FriendRequest.findByPk(requestID);
    if (!fr) {
      return res.status(404).send({
        success: false,
        message: "This friend request does not exist",
      });
    }

    if (fr.userFrom === session.userId) {
      return res.status(401).send({
        success: false,
        message:
          "You cannot change the status of the request because you are the one who sent it",
      });
    }

    fr.didReject = true;

    await fr.save();

    return res.status(200).send({
      success: true,
      message: "Friend request rejected",
    });
  } catch (e) {
    console.log("there")
    console.log(e);
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.delete("/cancel-friend-request/", async (req, res) => {
  const { body } = req;
  const { token, requestID } = body;

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
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }

    const fr = await FriendRequest.findByPk(requestID);
    if (!fr) {
      return res.status(404).send({
        success: false,
        message: "This friend request does not exist",
      });
    }

    if (fr.userFrom !== session.userId) {
      return res.status(401).send({
        success: false,
        message:
          "You cannot change the status of the request because you are not the one who sent it",
      });
    }

    await fr.destroy();

    return res.status(200).send({
      success: true,
      message: "Friend request cancelled",
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.post("/accept-friend-request/", async (req, res) => {
  const { body } = req;
  const { token, requestID } = body;

  try {
    const session = await UserSession.findByPk(token);
    if (!session || session.isDeleted) {
      return res.status(401).send({
        success: false,
        message: "Invalid TToken",
      });
    }

    const user = await User.findByPk(session.userId);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid Token",
      });
    }

    const fr = await FriendRequest.findByPk(requestID);
    if (!fr) {
      return res.status(404).send({
        success: false,
        message: "This friend request does not exist",
      });
    }

    if (fr.userFrom === session.userId) {
      return res.status(401).send({
        success: false,
        message:
          "You cannot change the status of the request because you are the one who sent it",
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
      message: "Friend request accepted",
    });
  } catch (e) {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.post("/rename-friend/", async (req, res) => {
  const { body } = req;
  const { token, friendID, name } = body;

  try {
    const session = await UserSession.findByPk(token);
    if (!session || session.isDeleted) {
      return res.status(401).send({
        success: false,
        message: "Invalid session",
      });
    }

    const user = await User.findByPk(session.userId);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }

    const contact = await Contact.findOne({
      where: {
        [Op.or]: [{
          userOneId: user.id,
          userTwoId: friendID
        }, {
          userTwoId: user.id,
          userOneId: friendID
        }]
      }
    });

    if (!contact) {
      return res.status(401).send({
        success: false,
        message: "You are not friends with this person"
      })
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
        message: "You are not friends with this person",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Friend renamed",
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.post("/delete-friend/", async (req, res) => {
  const { body } = req;
  const { token, friendID } = body;

  try {
    const session = await UserSession.findByPk(token);
    if (!session) {
      return res.status(401).send({
        success: false,
        message: "Invalid session",
      });
    }

    const user = await User.findByPk(session.userId);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }

    const contact = await Contact.findOne({
      where: {
        [Op.or]: [{
          userOneId: user.id,
          userTwoId: friendID
        }, {
          userTwoId: user.id,
          userOneId: friendID
        }]
      }
    });

    if (!contact) {
      return res.status(401).send({
        success: false,
        message: "You are not friends with this person"
      })
    }

    await contact.destroy();

    return res.status(200).send({
      success: true,
      message: "Friend deleted",
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.get("/get-friend-requests/", async (req, res) => {
  const { query } = req;
  const { token } = query;

  try {
    const session = await UserSession.findByPk(token);
    if (!session || session.isDeleted) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      })
    }

    const user = await User.findByPk(session.userId);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      })
    }

    const requests = await FriendRequest.findAll({
      where: {
        [Op.or]: [{
          userFrom: user.id,
        },
        {
          userTo: user.id,
        }]
      }
    })

    return res.status(200).send({
      success: true,
      message: "Contacts fetched",
      requests: requests,
    })
  }
  catch (e) {
    return res.status(401).send({
      success: false,
      message: "Invalid token"
    })
  }
})

router.get("/get-contacts/", async (req, res) => {
  const { query } = req;
  const { token } = query;

  try {
    const session = await UserSession.findByPk(token);
    if (!session || session.isDeleted) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      })
    }

    const user = await User.findByPk(session.userId);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      })
    }

    const contacts = await Contact.findAll({
      where: {
        [Op.or]: [{
          userOneId: user.id,
        },
        {
          userTwoId: user.id,
        }]
      }
    })

    return res.status(200).send({
      success: true,
      message: "Contacts fetched",
      contacts: contacts,
    })
  }
  catch (e) {
    return res.status(401).send({
      success: false,
      message: "Invalid token"
    })
  }
})

module.exports = router;
