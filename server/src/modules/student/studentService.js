const Student = require("./studentModel");
const StudentStatus = require("./studentStatusModel");
const Faculty = require("../faculty/facultyModel");
const Program = require("../program/programModel");
const NIDCard = require("./nidCardModel");
const OIDCard = require("./oidCardModel");
const Passport = require("./passportModel");
const { Op } = require("sequelize");
const Nationality = require("../nationality/nationalityModel");
const studentError = require("./studentError");
const { body } = require("express-validator");
const {
  DuplicateResourceError,
  ValidationError,
  NotFoundError,
} = require("../../util/errors");
const { validatePhone, validateEmail } = require("../../util/validator");

// async function validateFullName() {
//   return [body("fullName").notEmpty().withMessage("Full name is required")];
// }

// async function validateDateOfBirth() {
//   return [
//     body("dateOfBirth")
//       .isISO8601()
//       .withMessage("Invalid date of birth (use YYYY-MM-DD)"),
//   ];
// }

// async function validateGender() {
//   return [
//     body("gender")
//       .isIn(["Nam", "Nữ", "Khác"])
//       .withMessage("Gender must be Nam, Nữ, or Khác"),
//   ];
// }

// async function validateEmail() {
//   console.log("email");
//   return [body("email").isEmail().withMessage("Invalid email format")];
// }

// async function validatePhoneNumber() {
//   return [
//     body("phoneNumber")
//       .matches(/^[0-9]{10}$/)
//       .withMessage("Phone number must be 10 digits"),
//   ];
// }

// const StudentValidationRules = [
//   validateFullName(),
//   validateDateOfBirth(),
//   validateGender(),
//   validateEmail(),
//   validatePhoneNumber(),
// ];

// async function checkStudentData(req) {
//   await Promise.all(
//     StudentService.StudentValidationRules.map((rule) => rule.run(req))
//   );
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return {
//       success: false,
//       data: errors.array(),
//     };
//   }
//   return {
//     success: true,
//     data: null,
//   };
// }

async function deleteStudent(studentId) {
  try {
    const deleted = await Student.destroy({
      where: { studentId },
    });
    if (deleted === 0) {
      return {
        success: false,
        error: studentError.UNKNOWN_STUDENT,
      };
    }
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in studentService.deleteStudent: ", error.message);
    throw studentError.INTERNAL_ERROR;
  }
}

async function createStudent(newStudent) {
  console.log(newStudent);
  const existingStudent = await Student.findOne({
    where: { email: newStudent.email },
  });
  if (existingStudent) {
    throw new DuplicateResourceError(
      "Student already exists",
      "Sinh viên này đã tồn tại trong hệ thống"
    );
  }

  if (newStudent.email && !validateEmail(newStudent.email)) {
    throw new ValidationError(
      "Invalid Email. The email must end with @student.university.edu.vn",
      "Email không hợp lệ. Email phải kết thúc với @student.university.edu.vn"
    );
  }

  if (
    newStudent.phoneNumber &&
    !validatePhone(newStudent?.phoneNumber, newStudent?.nationalityId)
  ) {
    throw new ValidationError(
      "Invalid phone number.",
      "Số điện thoại không hợp lệ. Vui lòng thử lại"
    );
  }

  const student = await Student.create(newStudent);
  return { success: true, student };
}

async function updateStudent(studentId, updatedData) {
  const student = await Student.findOne({ where: { studentId } });
  if (!student) {
    throw new NotFoundError(
      "Student not exists",
      "Sinh viên này không tồn tại"
    );
  }
  if (updatedData.email && !validateEmail(updatedData.email)) {
    
    throw new ValidationError(
      "Invalid Email. The email must end with @student.university.edu.vn",
      "Email không hợp lệ. Email phải kết thúc với @student.university.edu.vn"
    );
  }

  if (
    updatedData.phoneNumber &&
    !validatePhone(updatedData?.phoneNumber, updatedData?.nationalityId)
  ) {
    throw new ValidationError(
      "Invalid phone number.",
      "Số điện thoại không hợp lệ. Vui lòng thử lại"
    );
  }

  await student.update(updatedData);
  return {
    success: true,
    data: student,
  };
}

async function getPaginatedStudents(queryParams) {
  try {
    const {
      studentId,
      fullName,
      courseId,
      facultyId,
      programId,
      page = 1,
      limit = 10,
    } = queryParams;
    const whereClause = {};
    if (studentId) whereClause.studentId = studentId;
    else {
      if (fullName) whereClause.fullName = { [Op.like]: `%${fullName}%` };
      if (courseId) whereClause.courseId = courseId;
      if (facultyId) whereClause.facultyId = facultyId;
      if (programId) whereClause.programId = programId;
    }
    const students = await Student.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Faculty,
          attributes: ["short_name", "name"],
          as: "Faculty",
        },
        {
          model: Program,
          attributes: ["short_name", "name"],
          as: "Program",
        },
        {
          model: StudentStatus,
          attributes: ["name"],
          as: "StudentStatus",
        },
        {
          model: NIDCard,
          attributes: [
            "id",
            "placeOfIssue",
            "dateOfIssue",
            "expiryOfIssue",
            "chip",
          ],
        },
        {
          model: OIDCard,
          attributes: ["id", "placeOfIssue", "dateOfIssue", "expiryOfIssue"],
        },
        {
          model: Passport,
          attributes: [
            "id",
            "dateOfIssue",
            "placeOfIssue",
            "expiryOfIssue",
            "country",
            "note",
          ],
        },
      ],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
    });

    const formattedStudents = students.rows.map((student) => {
      const identityTypes = [
        { type: "NIDCard", key: "NIDCard" },
        { type: "OIDCard", key: "OIDCard" },
        { type: "Passport", key: "Passport" },
      ];
      const identityDocuments = identityTypes
        .map(
          ({ type, key }) =>
            student[key] && { type, ...student[key].get({ plain: true }) }
        )
        .filter(Boolean);

      const studentData = student.get({ plain: true });
      ["NIDCard", "OIDCard", "Passport"].forEach(
        (key) => delete studentData[key]
      );

      return Object.assign(studentData, { identityDocuments });
    });

    return {
      success: true,
      students: formattedStudents,
      total: students.count,
    };
  } catch (error) {
    console.error(
      "Error in studentService.getFilteredStudents:",
      error.message
    );
    throw studentError.INTERNAL_ERROR;
  }
}

async function getStatuses() {
  try {
    const status = await StudentStatus.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    return {
      success: true,
      statuses: status,
    };
  } catch (error) {
    console.error("Error in StudentService.getStatuses:", error.message);
    throw studentError.INTERNAL_ERROR;
  }
}

async function updateStatus(statusId, updatedData) {
  try {
    const [affectedRows] = await StudentStatus.update(updatedData, {
      where: { statusId },
    });
    if (affectedRows === 0) {
      return {
        success: false,
        data: null,
      };
    }
    return {
      success: true,
      data: true,
    };
  } catch (error) {
    console.error("Error in StudentService.updateStatus:", error.message);
    throw studentError.INTERNAL_ERROR;
  }
}

async function createStatus(newStatus) {
  try {
    const status = await StudentStatus.create(newStatus);
    return {
      success: true,
      status: status,
    };
  } catch (error) {
    console.error("Error in StudentService.createStatus:", error.message);
    throw studentError.INTERNAL_ERROR;
  }
}

async function getAllStudents(filters) {
  try {
    const whereClause = {};

    if (filters.studentId) whereClause.studentId = filters.studentId;
    if (filters.fullName)
      whereClause.fullName = { [Op.like]: `%${filters.fullName}%` };
    if (filters.facultyId) whereClause.facultyId = filters.facultyId;
    if (filters.courseId) whereClause.courseId = filters.courseId;
    if (filters.programId) whereClause.programId = filters.programId;

    const students = await Student.findAll({
      where: whereClause,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Faculty,
          attributes: ["short_name", "name"],
          as: "Faculty",
        },
        {
          model: Program,
          attributes: ["short_name", "name"],
          as: "Program",
        },
        {
          model: StudentStatus,
          attributes: ["name"],
          as: "StudentStatus",
        },
        {
          model: NIDCard,
          attributes: [
            "id",
            "placeOfIssue",
            "dateOfIssue",
            "expiryOfIssue",
            "chip",
          ],
        },
        {
          model: OIDCard,
          attributes: ["id", "placeOfIssue", "dateOfIssue", "expiryOfIssue"],
        },
        {
          model: Passport,
          attributes: [
            "id",
            "dateOfIssue",
            "placeOfIssue",
            "expiryOfIssue",
            "country",
            "note",
          ],
        },
        {
          model: Nationality,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });

    const formattedStudents = students.map((student) => {
      const identityDocuments = [];
      if (student.NIDCard)
        identityDocuments.push({
          type: "NIDCard",
          ...student.NIDCard.get({ plain: true }),
        });
      if (student.OIDCard)
        identityDocuments.push({
          type: "OIDCard",
          ...student.OIDCard.get({ plain: true }),
        });
      if (student.Passport)
        identityDocuments.push({
          type: "Passport",
          ...student.Passport.get({ plain: true }),
        });

      const studentData = student.get({ plain: true });
      delete studentData.NIDCard;
      delete studentData.OIDCard;
      delete studentData.Passport;

      return { ...studentData, identityDocuments };
    });

    return formattedStudents;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách students:", error);
    return [];
  }
}

module.exports = {
  // validateFullName,
  // validateDateOfBirth,
  // validateGender,
  // validateEmail,
  // validatePhoneNumber,
  // StudentValidationRules,
  // checkStudentData,

  deleteStudent,
  createStudent,
  updateStudent,
  getPaginatedStudents,
  getStatuses,
  createStatus,
  updateStatus,
  getAllStudents,
};
