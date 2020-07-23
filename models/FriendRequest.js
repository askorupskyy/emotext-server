const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const FriendRequest = sequelize.define("friendRequest", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
  },
  userFrom: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  userTo: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  didAccept: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
  didReject: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
  didIgnore: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
}, { freezeTableName: true });

module.exports = FriendRequest;
