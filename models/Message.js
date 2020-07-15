const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const Message = sequelize.define("Message", {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
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
