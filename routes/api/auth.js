const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const { Op } = require("sequelize");

const UserSession = require("../../models/UserSession");
const PasswordResetCode = require("../../models/PasswordResetCode");
const User = require("../../models/User");

const { SMTP_EMAIL, SMTP_PASSWORD, HOST } = require("../../cfg");

const {
  generateLink,
  validatePassword,
  generateHash,
} = require("../../util/generateBytes");

const router = express.Router();

const smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
});

const handlebarsOptions = {
  viewEngine: {
    extName: "handlebars",
    partialsDir: path.resolve("./templates/"),
    layoutsDir: path.resolve("./templates/"),
    defaultLayout: "email.html",
  },
  viewPath: path.resolve("./templates/"),
  extName: ".html",
};

smtpTransport.use("compile", hbs(handlebarsOptions));

router.post("/signup/", async (req, res) => {
  const { body } = req;
  const { name, password, username } = body;
  let { email } = body;
  if (!name || !password || !email || !username) {
    return res.status(401).send({
      success: false,
      message: "Fill out all the fields!",
    });
  }
  email = email.toLowerCase();
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: email }, { username: username }],
    },
  });
  if (user) {
    return res.status(401).send({
      success: false,
      message: "A User with these credentials already exists",
    });
  }
  let validPasswordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
  );
  if (!validPasswordRegex.test(password)) {
    return res.status(401).send({
      success: false,
      message:
        "A password must contain at least 1 uppercase and 1 lowercase character, 1 number, and have the minimum length of 6",
    });
  }
  await User.create({
    email: email,
    password: generateHash(password),
    name: name,
    username: username,
  });
  return res.status(200).send({
    success: true,
    message: "Signed up!",
  });
});

router.post("/signin/", async (req, res) => {
  const { body } = req;
  let { email, password } = body;
  email = email.toLowerCase();
  if (!email || !password) {
    return res.status(401).send({
      success: false,
      message: "Email and password fields cannot be empty.",
    });
  }
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found.",
    });
  }

  if (!validatePassword(password, user.password)) {
    return res.status(401).send({
      success: false,
      message: "Incorrect password.",
    });
  }

  const newUserSession = await UserSession.create({
    userId: user.id,
  });
  return res.status(200).send({
    success: true,
    message: "Signed In",
    token: newUserSession.id,
  });
});

router.get("/verify/", async (req, res) => {
  const { query } = req;
  const { token } = query;

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
    return res.status(200).send({
      success: true,
      message: "Valid",
    });
  }
  catch{
    return res.status(401).send({
      success: false,
      message: "Invalid token"
    })
  }
});

router.get("/logout/", async (req, res) => {
  const { query } = req;
  const { token } = query;

  try {
    const session = await UserSession.findByPk(token);
    if (!session || session.isDeleted) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }
    await session.update({ isDeleted: true });
    return res.status(200).send({
      success: true,
      message: "Logged out",
    });
  } catch (e) {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.get("/get-user-by-token/", async (req, res) => {
  const { query } = req;
  const { token } = query;

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
    return res.status(200).send({
      success: true,
      message: "User found",
      user: user,
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.post("/get-reset-token/", async (req, res) => {
  const { body } = req;
  const { email } = body;
  const link = generateLink(20);
  const resetCode = await PasswordResetCode.create({
    code: link,
    email: email,
  });

  let data = {
    to: email,
    from: SMTP_EMAIL,
    template: "forgot-password-email",
    subject: "Password help has arrived!",
    context: {
      url: `http://${HOST}:${3000}/auth/reset-password/?token=${
        resetCode.code
        }`,
    },
  };

  smtpTransport.sendMail(data, function (err) {
    if (!err)
      return res.status(200).send({
        success: true,
        message: "Done! Kindly check your email for further instructions",
      });
    return res.status(500).send({
      success: false,
      message: "Server error",
    });
  });
});

router.get("/verify-reset-token/", async (req, res) => {
  const { query } = req;
  const { token } = query;

  const code = await PasswordResetCode.findByPk(token);
  if (!code) {
    return res.status(404).send({
      success: false,
      message: "Invalid token",
    });
  } else {
    let codesDate = new Date(code.date).getTime();
    let currentDate = new Date().getTime();
    if (currentDate - codesDate > 600000) {
      return res.status(401).send({
        success: false,
        message: "Token expired",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Token valid",
    });
  }
});

router.post("/reset-password/", async (req, res) => {
  const { body } = req;
  const { token, password } = body;

  const code = await PasswordResetCode.findByPk(token);
  if (!code) {
    return res.status(404).send({
      success: false,
      message: "Invalid",
    });
  } else {
    let codesDate = new Date(code.date).getTime();
    let currentDate = new Date().getTime();

    if (currentDate - codesDate > 600000) {
      return res.send({
        success: false,
        message: "Token expired",
      });
    }
    const user = await User.findOne({ where: { email: code.email } });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid code",
      });
    } else {
      user.update({
        password: generateHash(password),
      });
      return res.status(200).send({
        success: true,
        message: "Password changed!",
      });
    }
  }
});

router.get("/get-user-by-id/", async (req, res) => {
  const { query } = req;
  const { id } = query;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "User found",
      user: user,
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid ID",
    });
  }
});

router.post("/change-bio/", async (req, res) => {
  const { body } = req;
  const { token, bio } = body;

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
        message: "Invalid session",
      });
    }
    await user.update({
      bio: bio,
    });
    return res.status(200).send({
      success: true,
      message: "Bio updated",
    });
  } catch {
    res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

router.post("/update-profile-picture/", async (req, res) => {
  try {
    if (!req.files) {
      res.send(401).send({
        success: false,
        message: "No file uploaded.",
      });
    } else {
      const { token } = req.body;
      let avatar = req.files.profilePicture;

      try {
        const session = await UserSession.findByPk(token);
        if (!session || session.isDeleted) {
          return res.status(401).send({
            success: false,
            message: `Invalid token`,
          });
        }
        let extension = avatar.substring(avatar.indexOf(".") + 1);
        if (extension.indexOf("jpeg") == -1 || extension.indexOf("png") == -1) {
          return res.status(401).send({
            success: false,
            message: "Please upload a file in a supported file format"
          })
        }

        const user = await User.findByPk(session.userId);
        if (!user) {
          return res.status(401).send({
            success: false,
            message: "Invalid token",
          });
        }
        user.profilePictureURL = `../../media/profile-pictures/${userId}${extension}`;

        await user.save();

        avatar.mv(`../../media/profile-pictures/`);
        return res.status(200).send({
          success: true,
          message: "Picture updated",
        });
      } catch {
        return res.status(401).send({
          success: false,
          message: "Invalid token",
        });
      }
    }
  } catch (e) {
    return res.send({
      success: false,
      message: "Server error.",
    });
  }
});

router.post("/change-privacy-settings/", async (req, res) => {
  const { body } = req;
  const { seeEmail, textMe, seeRealName, token } = body;
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

    user.seeEmail = seeEmail;
    user.textMe = textMe;
    user.seeRealName = seeRealName;
    await user.save();
    return res.status(200).send({
      success: true,
      message: "Settings updated",
    });
  } catch {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
});

module.exports = router;
