const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const UserSession = sequelize.define("UserSession", {
  uuid: {
    type: Sequelize.STRING,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  timestamp: {
    type: DataTypes.DATE,
    default: Date.now(),
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
});

module.exports = UserSession;
