const Student = require("./studentModel");
const StudentStatus = require("./studentStatusModel");
const NIDCard = require("./nidCardModel");
const OIDCard = require("./oidCardModel");
const Passport = require("./passportModel");
const { Op } = require("sequelize");
const Nationality = require("../nationality/nationalityModel");

async function deleteStudent(studentId) {
  try {
    const deleted = await Student.destroy({
      where: { studentId },
    });
    if (deleted === 0) {
      return "Unknown student";
    }
    return null;
  } catch (error) {
    console.error("Error in studentService.deleteStudent: ", error.message);
    throw new Error("Error server");
  }
}

async function createStudent(newStudent) {
  try {
    const existingStudent = await Student.findOne({
      where: { email: newStudent.email },
    });
    if (existingStudent) {
      return { error: "Email đã tồn tại. Vui lòng chọn email khác." };
    }
    const student = await Student.create(newStudent);
    return { success: true, student };
  } catch (error) {
    console.error("Error in studentService.createStudent: ", error.message);
    throw new Error("Error server");
  }
}

async function updateStudent(studentId, updatedData) {
  try {
    const student = await Student.findOne({ where: { studentId } });
    if (!student) {
      return null;
    }
    await student.update(updatedData);
    return student;
  } catch (error) {
    console.error("Error in studentService.updateStudent:", error.message);
    throw new Error("Error server");
  }
}

async function getStudents(queryParams) {
  try {
    const { studentId, fullName, courseId, facultyId, programId, page = 1, limit = 10, } = queryParams;
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
          model: NIDCard,
          attributes: ["id", "placeOfIssue", "dateOfIssue", "expiryOfIssue", "chip"],
        },
        {
          model: OIDCard,
          attributes: ["id", "placeOfIssue", "dateOfIssue", "expiryOfIssue"],
        },
        {
          model: Passport,
          attributes: ["id", "dateOfIssue", "placeOfIssue", "expiryOfIssue", "country", "note"],
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
        .map(({ type, key }) => student[key] && { type, ...student[key].get({ plain: true }) })
        .filter(Boolean);

      const studentData = student.get({ plain: true });
      ["NIDCard", "OIDCard", "Passport"].forEach((key) => delete studentData[key]);

      return Object.assign(studentData, { identityDocuments });
    });

    return { students: formattedStudents, total: students.count };
  } catch (error) {
    console.error("Error in studentService.getFilteredStudents:", error.message);
    throw new Error("Error server");
  }
}

async function getStatuses() {
  try {
    return StudentStatus.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
  } catch (error) {
    console.error("Error in StudentService.getStatuses:", error.message);
    throw new Error("Error Server");
  }
}

async function updateStatus(statusId, updatedData) {
  try {
    const [affectedRows] = await StudentStatus.update(updatedData, {
      where: { statusId }
    });
    if (affectedRows === 0) {
      return null;
    }
    return true;
  } catch (error) {
    console.error("Error in StudentService.updateStatus:", error.message);
    throw new Error("Error server");
  }
}

async function createStatus(newStatus) {
  try {
    const status = await StudentStatus.create(newStatus);
    return status;
  } catch (error) {
    console.error("Error in StudentService.createStatus:", error.message);
    throw new Error("Error server");
  }
}

async function getToExportStudents(filters) {
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
          model: NIDCard,
          attributes: ["id", "placeOfIssue", "dateOfIssue", "expiryOfIssue", "chip"],
        },
        {
          model: OIDCard,
          attributes: ["id", "placeOfIssue", "dateOfIssue", "expiryOfIssue"],
        },
        {
          model: Passport,
          attributes: ["id", "dateOfIssue", "placeOfIssue", "expiryOfIssue", "country", "note"],
        },
        {
          model: PermanentAddress,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: TemporaryResidenceAddress,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: MailAddress,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Nationality,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });

    const formattedStudents = students.map(student => {
      const identityDocuments = [];
      if (student.NIDCard) identityDocuments.push({ type: "NIDCard", ...student.NIDCard.get({ plain: true }) });
      if (student.OIDCard) identityDocuments.push({ type: "OIDCard", ...student.OIDCard.get({ plain: true }) });
      if (student.Passport) identityDocuments.push({ type: "Passport", ...student.Passport.get({ plain: true }) });

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
  deleteStudent,
  createStudent,
  updateStudent,
  getStudents,
  getStatuses,
  createStatus,
  updateStatus,
  getToExportStudents,
};
