// CMND model

const sequelize = require("../../config/database");
const { DataTypes } = require("sequelize");

const OIDCard = sequelize.define(
  "OIDCard",
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
  },
  {
    timestamps: true,
    tableName: "oid_card",
  }
);

module.exports = OIDCard;
