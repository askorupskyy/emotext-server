const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const UserSession = sequelize.define("userSession", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: Date.now(),
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, { freezeTableName: true });

module.exports = UserSession;
