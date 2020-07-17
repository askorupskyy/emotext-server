const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const UserRestrictions = sequelize.define("UserRestrictions", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
  },
  restrictedUserID: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  userID: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  isMuted: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
  canCall: {
    type: DataTypes.BOOLEAN,
    default: true,
  },
  canSendPics: {
    type: DataTypes.BOOLEAN,
    default: true,
  },
});

module.exports = UserRestrictions;
