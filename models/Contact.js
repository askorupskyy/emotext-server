const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const Contact = sequelize.define("Contact", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
  },
  userOneId: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  userTwoId: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "",
  },
  userOneName: {
    type: DataTypes.STRING,
    default: "",
  },
  userTwoName: {
    type: DataTypes.STRING,
    default: "",
  },
});

module.exports = Contact;
