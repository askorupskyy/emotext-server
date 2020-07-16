const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const Chat = sequelize.define("Chat", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
  },
  userOne: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  userTwo: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    default: false,
  },
});

module.exports = Chat;
