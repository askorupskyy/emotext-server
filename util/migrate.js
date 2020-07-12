const db = require('./db');

const Chat = require('../models/Chat');
const EmailVerificationCode = require('../models/EmailVerificationCode');
const Friendship = require('../models/Friendship');
const Message = require('../models/Message');
const PasswordResetCode = require('../models/PasswordResetCode');
const User = require('../models/User');
const UserSession = require('../models/UserSession');

db.sync();