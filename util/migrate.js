const db = require('./db');

const Chat = require('../models/Chat');
const Contact = require('../models/Contact');
const EmailVerificationCode = require('../models/EmailVerificationCode');
const FriendRequest = require('../models/FriendRequest');
const GroupChat = require('../models/GroupChat');
const Message = require('../models/Message');
const PasswordResetCode = require('../models/PasswordResetCode');
const User = require('../models/User');
const UserRestrictions = require('../models/UserRestrictions');
const UserSession = require('../models/UserSession');

db.sync();