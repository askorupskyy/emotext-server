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
    default: false,
  },
  creator: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  admins: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    default: [],
  },
}, { freezeTableName: true });

module.exports = GroupChat;
