const Student = require("./studentModel");
const StudentStatus = require("./studentStatusModel");
const Faculty = require("../faculty/facultyModel");
const NIDCard = require("./nidCardModel");
const OIDCard = require("./oidCardModel");
const Passport = require("./passportModel");
const { get } = require("../../route/studentRoute");
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

async function getOneStudentById(studentId) {
  try {
    const student = await Student.findOne({
      where: { studentId },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
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
          attributes: ["id", "name", "code"],
        },
      ],
    });

    const identityTypes = [
      { type: "NIDCard", key: "NIDCard" },
      { type: "OIDCard", key: "OIDCard" },
      { type: "Passport", key: "Passport" },
    ];

    const identityDocument =
      identityTypes
        .map(
          ({ type, key }) =>
            student[key] && { type, ...student[key].get({ plain: true }) }
        )
        .find(Boolean) || null; // Pick the first available document

    // Convert student to plain object & exclude identity models
    const studentData = student.get({ plain: true });
    ["NIDCard", "OIDCard", "Passport"].forEach(
      (key) => delete studentData[key]
    );

    return Object.assign(studentData, { identityDocument });
  } catch (error) {
    console.error("Error in studentService.getOneStudentById:", error.message);
    throw new Error("Error server");
  }
}

async function getStudentsByName(fullName, page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;
    const { count: total, rows: students } = await Student.findAndCountAll({
      where: { fullName },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    return { students, total };
  } catch (error) {
    console.error("Error in StudentService.getStudentsByName:", error.message);
    throw new Error("Error Server");
  }
}

async function getStudentsByFaculty(facultyName, page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;
    const { count: total, rows: students } = await Student.findAndCountAll({
      where: {},
      include: {
        model: Faculty,
        where: { facultyName },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    return { students, total };
  } catch (error) {
    console.error("Error in StudentService.getStudentsByFaculty:", error.message);
    throw new Error("Error Server");
  }
}

async function getStudentsByPageLimit(page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;
    const { count, rows: students } = await Student.findAndCountAll({
      attributes: { exclude: ["createdAt", "updatedAt"] }, // Loại bỏ các cột không cần
      limit,
      offset,
    });
    return {
      total: count,
      students,
    };
  } catch (error) {
    console.error(
      "Error in studentService.getStudentsByPageLimit:",
      error.message
    );
    throw new Error("Error server");
  }
}

async function getStudents({ query = "", page = 1, limit = 10 }) {
  const whereCondition = query
    ? {
      [Op.or]: [
        { studentId: query }, // Exact match for studentId
        { fullName: { [Op.like]: `%${query}%` } }, // Partial match for fullName
      ],
    }
    : {}; // No filter, fetch all students

  const { rows: students, count: total } = await Student.findAndCountAll({
    where: whereCondition,
    offset: (page - 1) * limit,
    limit: limit,
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
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
    order: [["fullName", "ASC"]],
  });

  const modifiedStudents = students.map((student) => {
    const identityTypes = [
      { type: "NIDCard", key: "NIDCard" },
      { type: "OIDCard", key: "OIDCard" },
      { type: "Passport", key: "Passport" },
    ];

    const identityDocument =
      identityTypes
        .map(
          ({ type, key }) =>
            student[key] && { type, ...student[key].get({ plain: true }) }
        )
        .find(Boolean) || null;

    const studentData = student.get({ plain: true });
    ["NIDCard", "OIDCard", "Passport"].forEach(
      (key) => delete studentData[key]
    );

    return { ...studentData, identityDocument };
  });

  return { students: modifiedStudents, total, page, limit };
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

module.exports = {
  deleteStudent,
  createStudent,
  getOneStudentById,
  getStudentsByName,
  getStudentsByFaculty,
  updateStudent,
  getStudentsByPageLimit,
  getStudents,
  getStatuses,
  createStatus,
  updateStatus,
};
