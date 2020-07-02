const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const generateLink = require('../../util/generateBytes');
const PasswordResetCode = require('../../models/PasswordResetCode');
const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const fileUpload = require('express-fileupload');

const { SMTP_EMAIL, SMTP_PASSWORD, HOST } = require('../../cfg');


const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
    }
});

const handlebarsOptions = {
    viewEngine: {
        extName: 'handlebars',
        partialsDir: path.resolve('./templates/'),
        layoutsDir: path.resolve('./templates/'),
        defaultLayout: 'email.html',
    },
    viewPath: path.resolve('./templates/'),
    extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));

router.post('/signup/', (req, res) => {
    const { body } = req;
    const { name, password, username } = body;
    let { email } = body;
    if (!name || !password || !email || !username) {
        return res.send({
            success: false,
            message: 'Fill out all the fields!',
        });
    }
    email = email.toLowerCase();
    User.find({ email: email, userName: username }, (err, users) => {
        if (err) {
            return res.send({
                success: false,
                message: `Server Error: ${err}`,
            });
        } else if (users.length > 0) {
            return res.send({
                success: false,
                message: 'A user with this email or username already exists',
            });
        }
        else {
            let validPasswordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
            if (!validPasswordRegex.test(password)) {
                return res.send({
                    success: false,
                    message: 'A password must contain at least 1 uppercase and 1 lowercase character, 1 number, and have the minimum length of 6',
                });
            }

            const newUser = new User();
            newUser.email = email;
            newUser.name = name;
            newUser.password = newUser.generateHash(password);
            newUser.userName = username;
            newUser.save((err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: `Server Error: ${err}`,
                    });
                }
                return res.send({
                    success: true,
                    message: 'Signed Up!'
                })
            });
        }
    });
});

router.post('/signin/', (req, res) => {
    const { body } = req;
    let { email, password } = body;
    email = email.toLowerCase();
    if (!email || !password) {
        return res.send({
            success: false,
            message: 'Email and password fields cannot be empty.'
        });
    }
    User.find({ email: email }, (err, users) => {
        if (err) {
            return res.send({
                success: false,
                message: `Server Error: ${err}`,
            })
        }
        if (users.length == 0) {
            return res.send({
                success: false,
                message: `No user exists with this email.`,
            });
        }
        const user = users[0];
        if (!user.validatePassword(password)) {
            return res.send({
                success: false,
                message: 'Incorrect Password.'
            });
        }
        const newUserSession = new UserSession();
        newUserSession.userId = user._id;
        newUserSession.save((err, doc) => {
            if (err) {
                return res.send({
                    success: false,
                    message: `Server Error: ${err}`,
                });
            }

            return res.send({
                success: true,
                message: `Signed In`,
                token: doc._id,
            })
        })
    })
});

router.get('/verify/', (req, res) => {
    const { query } = req;
    const { token } = query;
    UserSession.find({ _id: token, isDeleted: false }, (err, sessions) => {
        if (err) {
            return res.send({
                success: false,
                message: `Server Error: ${err}`,
            });
        }
        if (!sessions) {
            return res.send({
                success: false,
                message: 'Invalid',
            });
        }
        return res.send({
            success: true,
            message: 'Success',
        })
    });
});

router.get('/logout/', (req, res) => {
    const { query } = req;
    const { token } = query;
    UserSession.findByIdAndUpdate({ _id: token, isDeleted: false, }, { $set: { isDeleted: true } }, null, (err, sessions) => {
        if (err) {
            return res.send({
                success: false,
                message: `Server Error: ${err}`,
            });
        }
        return res.send({
            success: true,
            message: 'Logged Out.'
        })
    })
});

router.get('/get-user-by-token/', (req, res) => {
    const { query } = req;
    const { token } = query;
    UserSession.find({ _id: token, isDeleted: false }, (err, sessions) => {
        if (err) {
            return res.send({
                success: false,
                message: `Server Error: ${err}`,
            });
        }
        if (!sessions) {
            return res.send({
                success: false,
                message: 'No sessions found.',
            });
        }
        User.findOne({ _id: sessions[0].userId }, (err, user) => {
            if (err) {
                return res.send({
                    success: false,
                    message: `Server Error: ${err}`,
                });
            }
            return res.send({
                success: true,
                user: user
            })
        })
    });
});

router.post('/get-reset-token/', (req, res) => {
    const { body } = req;
    const { email } = body;
    const link = generateLink(20);
    User.find({ email: email }, (err, user) => {
        if (err) {
            return res.send({
                success: false,
                message: `Server Error: ${err}`,
            });
        }
        if (user.length != 1) {
            return res.send({
                success: false,
                message: 'No such user exists.'
            });
        }
        token = new PasswordResetCode();
        token.code = link;
        token.email = email;
        token.save((err, t) => {
            if (err) {
                return res.send({
                    success: false,
                    message: `Server Error: ${err}`,
                });
            }
            let data = {
                to: email,
                from: SMTP_EMAIL,
                template: 'forgot-password-email',
                subject: 'Password help has arrived!',
                context: {
                    url: `http://${HOST}:${3000}/auth/reset-password/?token=${t.code}`,
                    name: `${user[0].firstName} ${user[0].lastName}`,
                }
            };

            smtpTransport.sendMail(data, function (err) {
                if (!err)
                    return res.send({ success: true, message: 'Done! Kindly check your email for further instructions' });
                return res.send({
                    success: false,
                    message: `${err}`
                });
            });
        });
    })
})

router.get('/verify-reset-token/', (req, res) => {
    const { query } = req;
    const { token } = query;
    PasswordResetCode.find({ code: token }, (err, codes) => {
        if (err) {
            return res.send({
                success: false,
                message: `Server Error: ${err}`,
            });
        }
        if (codes.length != 1) {
            return res.send({
                success: false,
                message: `Invalid Code.`,
            });
        }

        let codesDate = new Date(codes[0].date).getTime();
        let currentDate = new Date().getTime();

        if (currentDate - codesDate > 600000) {
            return res.send({
                success: false,
                message: `Token Expired.`,
            });
        }

        return res.send({
            success: true,
            message: `Token Valid.`,
        })
    })
});

router.post('/reset-password/', (req, res) => {
    const { body } = req;
    const { token, password, email } = body;
    PasswordResetCode.find({ code: token }, (err, codes) => {
        if (err) {
            return res.send({
                success: false,
                message: `Server Error: ${err}`,
            });
        }
        if (!codes || codes.length != 1) {
            return res.send({
                success: false,
                message: `Invalid`,
            })
        }

        let codesDate = new Date(codes[0].date).getTime();
        let currentDate = new Date().getTime();

        if (currentDate - codesDate > 600000) {
            return res.send({
                success: false,
                message: `Token Expired.`,
            });
        }

        User.find({ email: codes[0].email }, (err, users) => {
            if (err) {
                return res.send({
                    success: false,
                    message: `Server Error: ${err}`,
                });
            }
            if (!users || users.length != 1) {
                return res.send({
                    success: false,
                    message: `Invalid.`,
                });
            }
            users[0].password = users[0].generateHash(password);
            users[0].save((err, doc) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: `Server Error: ${err}`,
                    });
                }
                return res.send({
                    success: true,
                    message: `Success.`,
                });
            });
        });
    });
});

router.get('/get-user-by-id/', (req, res) => {
    const { query } = req;
    const { id } = query;
    User.findOne({ _id: id }, (err, usr) => {
        if (err) {
            return res.send({
                success: false,
                message: err,
            });
        }
        else {
            return res.send({
                success: true,
                message: 'User Found!',
                user: usr,
            });
        }
    });
});

router.put('/change-bio/', (req, res) => {
    const { token, bio } = req;
    UserSession.find({ _id: token, isDeleted: false, }, (err, sessions) => {
        if (err) {
            return res.send({
                success: false,
                message: `Server Error: ${err}`
            });
        }
        if (!sessions) {
            return res.send({
                success: false,
                message: `No sessions found.`
            });
        }
        else {
            User.findByIdAndUpdate({ _id: sessions[0].userId }, { $set: { bio: bio } }, null, (err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: `Server Error: ${err}`,
                    });
                }
                else {
                    return res.send({
                        success: true,
                        message: `Bio Updated.`,
                    });
                }
            });
        }
    });
});

router.post('/update-profile-picture/', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                success: false,
                message: 'No File Uploaded.'
            });
        }
        else {
            const { token } = req.body;
            let avatar = req.files.profilePicture;
            UserSession.find({ _id: token, isDeleted: false }, (err, sessions) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: `Server Error: ${err}`,
                    });
                }
                if (!sessions) {
                    return res.send({
                        success: false,
                        message: `Invalid Token`
                    });
                }
                else {
                    let extension = avatar.substring(avatar.indexOf(".") + 1);
                    User.findByIdAndUpdate({ _id: sessions[0].userId }, { $set: { profilePictureURL: `../../media/profile-pictures/${userId}${extension}` } }, null, (err, user) => {
                        if (err) {
                            return res.send({
                                success: false,
                                message: `Server Error: ${err}`,
                            });
                        }
                        else {
                            return res.send({
                                success: true,
                                message: 'Profile Picture Updated!'
                            })
                        }
                    })
                }
            });
            avatar.mv(`../../media/profile-pictures/`)
        }
    }
    catch{
        return res.send({
            success: false,
            message: 'Server Error.'
        })
    }
});

router.put('/change-private-settings/', (req, res) => {
    const { seeEmail, textMe, seeRealName, token } = req;
    UserSession.find({ _id: token, isDeleted: false }, (err, sessions) => {
        if (err) {
            return res.send({
                success: false,
                message: `Server Error: ${err}`,
            });
        }
        if (!sessions) {
            return res.send({
                success: false,
                message: `Invalid Token.`
            });
        }
        else {
            User.findByIdAndUpdate({ _id: sessions[0].id }, { $set: { seeEmail: seeEmail, textMe: textMe, seeRealName: seeRealName } }, (err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: `Server Error: ${err}.`
                    });
                }
                else {
                    return res.send({
                        success: true,
                        message: `User Privacy Settings Updated.`
                    });
                }
            });
        }
    });
});

module.exports = router;