const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const UserRestrictions = sequelize.define("userRestrictions", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
  },
  restrictedUserID: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  userID: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  isMuted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  canCall: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  canSendMedia: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, { freezeTableName: true });

module.exports = UserRestrictions;
