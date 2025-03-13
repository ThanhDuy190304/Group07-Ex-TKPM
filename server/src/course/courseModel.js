const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Course = sequelize.define(
  "Course",
  {
    courseId: {
      type: DataTypes.STRING, // e.g., "K2020"
      primaryKey: true,
      allowNull: false,
    },
    startYear: {
      type: DataTypes.INTEGER, // e.g., 2020
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "course",
  }
);

module.exports = Course;
