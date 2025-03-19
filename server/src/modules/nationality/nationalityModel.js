// CMND model

const sequelize = require("../../config/database");
const { DataTypes } = require("sequelize");

const Nationality = sequelize.define(
  "Nationality",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      max: 9,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
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
