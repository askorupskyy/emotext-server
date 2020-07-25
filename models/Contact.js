const sequelize = require("../util/db");
const { DataTypes, Sequelize } = require("sequelize");

const Contact = sequelize.define("contact", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
  },
  userOneId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  userTwoId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  userOneName: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  userTwoName: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
}, { freezeTableName: true });

module.exports = Contact;
