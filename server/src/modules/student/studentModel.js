const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/database");

const Faculty = require("../faculty/facultyModel");
const Course = require("../course/courseModel");
const Program = require("../program/programModel");
const NIDCard = require("./nidCardModel");
const OIDCard = require("./oidCardModel");
const Passport = require("./passportModel");
const Nationality = require("../nationality/nationalityModel");
const PermanentAddress = require("../address/permanentAddressModel");
const MailAddress = require("../address/mailAddressModel");
const TemporaryResidenceAddress = require("../address/temporaryResidenceAddressModel");

const Student = sequelize.define(
  "Student",
  {
    studentId: {
      type: DataTypes.STRING, // Mã số sinh viên, e.g., "21120001"
      primaryKey: true,
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
Student.belongsTo(Nationality, { foreignKey: "nationalId" });
Student.belongsTo(PermanentAddress, {foreignKey: "permanentAddressId"});
Student.belongsTo(TemporaryResidenceAddress, {foreignKey: "temporaryResidenceAddressId"});
Student.belongsTo(MailAddress, {foreignKey: "mailAddress"});

Student.hasOne(OIDCard, { foreignKey: "studentId" });
Student.hasOne(NIDCard, { foreignKey: "studentId" });
Student.hasOne(Passport, { foreignKey: "studentId" });

Faculty.hasMany(Student, { foreignKey: "facultyId" });
Course.hasMany(Student, { foreignKey: "courseId" });
Program.hasMany(Student, { foreignKey: "programId" });
Nationality.hasMany(Student, { foreignKey: "nationalId" });

PermanentAddress.hasOne(Student, {foreignKey: "permanentAddressId"});
TemporaryResidenceAddress.hasOne(Student, {foreignKey: "temporaryResidenceAddressId"});
MailAddress.belongsTo(Student, {foreignKey: "mailAddress"});

Passport.belongsTo(Student, { foreignKey: "studentId" });
NIDCard.belongsTo(Student, { foreignKey: "studentId" });
OIDCard.belongsTo(Student, { foreignKey: "studentId" });



// 🛠 Hook để tạo studentId dựa trên courseId
Student.beforeCreate(async (student, options) => {
  try {
    if (!student.courseId) {
      throw new Error("courseId is required to generate studentId");
    }

    const year = student.courseId.replace("K", "").slice(-2); // "K2021" -> "21"
    const prefix = `${year}000000`; // Bắt đầu từ 21000000

    // Tìm studentId lớn nhất hiện tại trong cùng courseId
    const lastStudent = await Student.findOne({
      where: {
        studentId: { [Op.like]: `${year}%` }, // Chỉ lấy studentId bắt đầu với năm đó
      },
      order: [["studentId", "DESC"]], // Sắp xếp giảm dần để lấy số cao nhất
    });

    let newId;
    if (lastStudent) {
      newId = (parseInt(lastStudent.studentId) + 1).toString();
    } else {
      newId = `${year}00001`; // Nếu chưa có ai, bắt đầu từ 2100001
    }

    student.studentId = newId; // Gán ID mới cho sinh viên
  } catch (error) {
    console.error("Error in beforeCreate hook:", error);
    throw error; // Ném lỗi để ngăn việc tạo đối tượng
  }
});

module.exports = Student;
