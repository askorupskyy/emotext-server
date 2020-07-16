const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const EmailVerificationCode = sequelize.define("EmailVerificationCode", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  date: {
    type: DataTypes.DATE,
    default: Date.now(),
  },
});

module.exports = EmailVerificationCode;
