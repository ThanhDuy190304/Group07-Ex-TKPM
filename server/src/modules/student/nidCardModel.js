// CCCD model

const sequelize = require("../../config/database");
const { DataTypes } = require("sequelize");

const NIDCard = sequelize.define(
  "NIDCard",
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
    chip: {
      type: DataTypes.BOOLEAN,
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
    tableName: "nid_cards",
  }
);

module.exports = NIDCard;
