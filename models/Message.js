const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const Message = sequelize.define("Message", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
  },
  fromId: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
});

module.exports = Message;
