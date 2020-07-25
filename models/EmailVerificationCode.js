const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const EmailVerificationCode = sequelize.define("emailVerificationCode", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: Date.now(),
  },
}, { freezeTableName: true });

module.exports = EmailVerificationCode;
