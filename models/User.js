const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const User = sequelize.define("User", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  profilePictureURL: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  seeRealName: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  seeEmail: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  textMe: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  // 0 - everybody
  // 1 - contacts only
  // 2 - noobody
  //many more privacy settings;
  isOnline: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  lastSeen: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Date.now(),
  },
  addToGroupChats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },

}, { freezeTableName: true });

module.exports = User;
