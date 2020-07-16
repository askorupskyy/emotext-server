const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const UserSession = require("../../models/UserSession");

const {
  findUserByEmailAndUserName,
  findUserByEmail,
  findUserSession,
  findUserBySession,
  findUserByID,
} = require("../../controllers/users/findUser");
const createUser = require("../../controllers/users/createUser");
const {
  getPasswordResetCode,
  createPasswordResetCode,
} = require("../../controllers/users/emails");

const { SMTP_EMAIL, SMTP_PASSWORD, HOST } = require("../../cfg");

const {
  generateLink,
  validatePassword,
  generateHash,
} = require("../../util/generateBytes");
const {
  setProfilePicture,
  updatePrivacySettings,
} = require("../../controllers/users/updateUser");

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
  try {
    user = await findUserByEmailAndUserName(email, username);
    if (user != null) {
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
    try {
      await createUser(email, password, name, username);
      return res.status(200).send({
        success: true,
        message: "Signed Up!",
      });
    } catch (e) {
      return res.status(500).send({
        success: false,
        message: "Server Error.",
      });
    }
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Server Error.",
    });
  }
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
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found.",
      });
    }
    if (!validatePassword(password, user.password)) {
      return res.status(401).send({
        success: false,
        message: "Incorrect Password.",
      });
    }
    try {
      const newUserSession = await UserSession.create({
        userId: user.id,
      });
      return res.status(200).send({
        success: true,
        message: "Signed In",
        token: newUserSession.id,
      });
    } catch (e) {
      return res.status(500).send({
        success: false,
        message: "Server Error",
      });
    }
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
});

router.get("/verify/", async (req, res) => {
  const { query } = req;
  const { token } = query;
  try {
    const session = await findUserSession(token);
    if (!session) {
      return res.status(404).send({
        success: false,
        message: "Invalid Token",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Valid",
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: e,
    });
  }
});

router.get("/logout/", async (req, res) => {
  const { query } = req;
  const { token } = query;
  try {
    const session = await findUserSession(token);
    if (!session) {
      return res.status(401).send({
        success: false,
        message: "Invalid Token",
      });
    }
    try {
      await session.update({ isDeleted: true });
      return res.status(200).send({
        success: true,
        message: "Logged Out.",
      });
    } catch (e) {
      return res.status(500).send({
        success: false,
        message: e + "",
      });
    }
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: e + "",
    });
  }
});

router.get("/get-user-by-token/", async (req, res) => {
  const { query } = req;
  const { token } = query;
  try {
    const user = await findUserBySession(token);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid Token",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Success",
      user: user,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
});

router.post("/get-reset-token/", async (req, res) => {
  const { body } = req;
  const { email } = body;

  const link = generateLink(20);
  try {
    const resetCode = await createPasswordResetCode(link, email);
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
        message: "Server Error",
      });
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
});

router.get("/verify-reset-token/", async (req, res) => {
  const { query } = req;
  const { token } = query;
  try {
    const code = await getPasswordResetCode(token);
    if (!code) {
      return res.status(404).send({
        success: false,
        message: "Invalid Token",
      });
    } else {
      let codesDate = new Date(code.date).getTime();
      let currentDate = new Date().getTime();

      if (currentDate - codesDate > 600000) {
        return res.status(401).send({
          success: false,
          message: "Token Expired.",
        });
      }
      return res.status(200).send({
        success: true,
        message: `Token Valid.`,
      });
    }
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
});

router.post("/reset-password/", async (req, res) => {
  const { body } = req;
  const { token, password } = body;
  try {
    const code = await getPasswordResetCode(token);
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
          message: "Token Expired",
        });
      }
      try {
        const user = await findUserByEmail(code.email);
        if (!user) {
          return res.status(401).send({
            success: false,
            message: "Invalid Code",
          });
        } else {
          user.update({
            password: generateHash(password),
          });
          return res.status(200).send({
            success: true,
            message: "Password Changed!",
          });
        }
      } catch (e) {
        return res.status(500).send({
          success: false,
          message: "Server Error",
        });
      }
    }
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
});

router.get("/get-user-by-id/", async (req, res) => {
  const { query } = req;
  const { id } = query;
  try {
    const user = await findUserByID(id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Incorrect ID",
      });
    }
    return res.status(200).send({
      success: true,
      message: "User Found",
      user: user,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
});

router.put("/change-bio/", async (req, res) => {
  const { token, bio } = req;
  try {
    const session = await findUserSession(token);
    if (!session) {
      return res.status(401).send({
        success: false,
        message: "Invalid Token",
      });
    }
    try {
      const user = await findUserByID(session.userId);
      if (!user) {
        return res.status(401).send({
          success: false,
          message: "Invalid Session",
        });
      }
      await user.update({
        bio: bio,
      });
      return res.status(200).send({
        success: true,
        message: "Bio Updated",
      });
    } catch (e) {
      return res.status(500).send({
        success: false,
        message: "Server Error",
      });
    }
  } catch (e) {
    return res.send({
      success: false,
      message: "Server Error.",
    });
  }
});

router.post("/update-profile-picture/", async (req, res) => {
  try {
    if (!req.files) {
      res.send(401).send({
        success: false,
        message: "No File Uploaded.",
      });
    } else {
      const { token } = req.body;

      let avatar = req.files.profilePicture;
      try {
        const session = await findUserSession(token);
        if (!session) {
          return res.status(401).send({
            success: false,
            message: `Invalid Token`,
          });
        }
        try {
          let extension = avatar.substring(avatar.indexOf(".") + 1);
          const update = await setProfilePicture(
            token,
            `../../media/profile-pictures/${userId}${extension}`
          );
          if (!update) {
            return res.status(404).send({
              success: false,
              message: "Invalid Token",
            });
          }
          avatar.mv(`../../media/profile-pictures/`);
          return res.status(200).send({
            success: true,
            message: "Picture Updated",
          });
        } catch (e) {
          return res.status(500).send({
            success: false,
            message: "Server Error",
          });
        }
      } catch (e) {
        return res.status(500).send({
          success: false,
          message: "Server Error",
        });
      }
    }
  } catch (e) {
    return res.send({
      success: false,
      message: "Server Error.",
    });
  }
});

router.put("/change-private-settings/", async (req, res) => {
  const { seeEmail, textMe, seeRealName, token } = req;
  try {
    const updated = await updatePrivacySettings(token, {
      seeEmail: seeEmail,
      textMe: textMe,
      seeRealName: seeRealName,
    });
    if (!updated) {
      return res.status(401).send({
        success: false,
        message: "Invalid Token",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Settings Updated",
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;
