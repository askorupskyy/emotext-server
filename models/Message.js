const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const Message = sequelize.define("message", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
  },
  fromId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  isGroupChat: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, { freezeTableName: true });

module.exports = Message;
