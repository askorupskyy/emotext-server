const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const EmailVerificationCode = sequelize.define("EmailVerificationCode", {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
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
