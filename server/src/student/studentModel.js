const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Faculty = require("../faculty/facultyModel");
const Course = require("../course/courseModel");
const Program = require("../program/programModel");

const Student = sequelize.define(
  "Student",
  {
    studentId: {
      type: DataTypes.STRING, // Mã số sinh viên, e.g., "21120001"
      primaryKey: true,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING, // Họ tên
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY, // Ngày tháng năm sinh
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("Nam", "Nữ", "Khác"), // Giới tính
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT, // Địa chỉ
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING, // Email
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phoneNumber: {
      type: DataTypes.STRING, // Số điện thoại liên hệ
      allowNull: false,
      validate: { is: /^[0-9]{10}$/ },
    },
    status: {
      type: DataTypes.ENUM(
        "Đang học",
        "Đã tốt nghiệp",
        "Đã thôi học",
        "Tạm dừng học"
      ), // Tình trạng sinh viên
      allowNull: false,
      defaultValue: "Đang học",
    },
  },
  {
    timestamps: true,
    tableName: "student",
  }
);

// Relationships
Student.belongsTo(Faculty, { foreignKey: "facultyId" });
Student.belongsTo(Course, { foreignKey: "courseId" });
Student.belongsTo(Program, { foreignKey: "programId" });
Faculty.hasMany(Student, { foreignKey: "facultyId" });
Course.hasMany(Student, { foreignKey: "courseId" });
Program.hasMany(Student, { foreignKey: "programId" });

module.exports = Student;
