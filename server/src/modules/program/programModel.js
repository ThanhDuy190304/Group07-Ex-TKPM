const sequelize = require("../../config/database");
const { DataTypes } = require("sequelize");

const Program = sequelize.define(
  "Program",
  {
    programId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "programs",
  }
);

module.exports = Program;
