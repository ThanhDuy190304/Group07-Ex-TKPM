// Ho chieu model

const sequelize = require("../../config/database");
const { DataTypes } = require("sequelize");

const Passport = sequelize.define(
  "Passport",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      max: 9,
    },
    dateOfIssue: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    expiryOfIssue: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    placeOfIssue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Enforces one-to-one
    },
  },
  {
    timestamps: true,
    tableName: "passport",
  }
);

module.exports = Passport;
