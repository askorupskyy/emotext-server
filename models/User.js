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
    default: "",
  },
  bio: {
    type: DataTypes.STRING,
    default: "",
  },
  isDeleted: {
    type: DataTypes.STRING,
    default: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  seeRealName: {
    type: DataTypes.INTEGER,
    default: 0,
  },
  seeEmail: {
    type: DataTypes.INTEGER,
    default: 0,
  },
  textMe: {
    type: DataTypes.INTEGER,
    default: 0,
  },
  // 0 - everybody
  // 1 - contacts only
  // 2 - noobody
  //many more privacy settings;
  isOnline: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
  lastSeen: {
    type: DataTypes.DATE,
    default: Date.now(),
  },
});

module.exports = User;
