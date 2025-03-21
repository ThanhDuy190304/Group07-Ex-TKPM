// CMND model

const sequelize = require("../../config/database");
const { DataTypes } = require("sequelize");

const Nationality = sequelize.define(
  "Nationality",
  {
    code: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "nationality",
  }
);

module.exports = Nationality;
