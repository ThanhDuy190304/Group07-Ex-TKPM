const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Course = sequelize.define(
  "Course",
  {
    courseId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    startYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "courses",
    hooks: {
      beforeCreate: (course) => {
        // Nếu chưa có courseId, tự động tạo từ năm hiện tại
        if (!course.courseId) {
          const currentYear = new Date().getUTCFullYear();
          course.courseId = `K${currentYear}`;
          course.startYear = currentYear;
        }
      },
    },
  }
);

module.exports = Course;
