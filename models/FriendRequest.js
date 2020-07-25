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
    defaultValue: "",
  },
  userTo: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  didAccept: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  didReject: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  didIgnore: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, { freezeTableName: true });

module.exports = FriendRequest;
