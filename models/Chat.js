const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const Chat = sequelize.define("chat", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
  },
  userOne: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  userTwo: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, { freezeTableName: true });

module.exports = Chat;
