const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Nationality = sequelize.define(
  "Nationality1",
  {
    nationalityId: {
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
    tableName: "nationalities1",
  }
);

module.exports = Nationality;
