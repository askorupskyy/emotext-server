const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const Chat = sequelize.define("Chat", {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
});

module.exports = Chat;
