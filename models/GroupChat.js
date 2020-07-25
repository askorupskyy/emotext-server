const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const GroupChat = sequelize.define("groupChat", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
  },
  users: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  creator: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  admins: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
  },
}, { freezeTableName: true });

module.exports = GroupChat;
