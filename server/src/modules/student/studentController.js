const { processFile } = require("../files/fileUploadService");
const StudentService = require("./studentService");
const { validationResult, body } = require("express-validator");
const logger = require("../../logger");
const Student = require("./studentModel");
const Faculty = require("../faculty/facultyModel");
const Program = require("../program/programModel");
const StudentStatus = require("./studentStatusModel");
const Nationality = require("../nationality/nationalityModel");
const Course = require("../course/courseModel");

//// Validation rules trong controller
const StudentValidationRules = [
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("dateOfBirth")
    .isISO8601()
    .withMessage("Invalid date of birth (use YYYY-MM-DD)"),
  body("gender")
    .isIn(["Nam", "Nữ", "Khác"])
    .withMessage("Gender must be Nam, Nữ, or Khác"),
  body("facultyId").notEmpty().withMessage("Faculty ID is required"),
  body("courseId").notEmpty().withMessage("Course ID is required"),
  body("programId").notEmpty().withMessage("Program ID is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("phoneNumber")
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must be 10 digits"),
  body("statusId").notEmpty().withMessage("Status ID is required"),
];

async function deleteStudent(req, res) {
  try {
    logger.info("deleteStudent");
    const result = await StudentService.deleteStudent(req.params.studentId);
    if (result) {
      return res.status(400).json({ message: result });
    }
    return res.status(204).send();
  } catch (error) {
    logger.error("Error deleteStudent", {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ error: error.message });
  }
}

async function postStudent(req, res) {
  try {
    // Kiểm tra validation
    logger.info("postStudent");
    await Promise.all(StudentValidationRules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Error postProgram", { errors: errors.array });
      return res
        .status(400)
        .json({ error: "Dữ liệu không hợp lệ", details: errors.array() });
    }
    const result = await StudentService.createStudent(req.body);
    if (result.error) {
      logger.error("Error postProgram", { message: result.error });
      return res.status(400).json({ error: result.error });
    }
    return res.status(201).json(result.student);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      logger.error("Error postProgram", {
        message: error.message,
        stack: error.stack,
      });
      return { error: error.response.data.error };
    }
    return { error: "Lỗi server" };
  }
}

async function putStudent(req, res) {
  // Kiểm tra validation ngay trong controller
  logger.info("putStudent");
  await Promise.all(StudentValidationRules.map((rule) => rule.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error("Error putStudent", { errors: errors.array });
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const studentId = req.params.studentId;
    const updatedData = req.body;
    const result = await StudentService.updateStudent(studentId, updatedData);
    if (!result) {
      logger.warn("Warn putStudent", { studentId });
      return res.status(404).json({ message: "Sinh viên không hợp lệ!" });
    }
    return res.status(200).json(result);
  } catch (error) {
    logger.error("Error putStudent", {
      message: error.message,
      stack: error.message,
    });
    return res.status(500).json({ error: error.message });
  }
}

async function getStudents(req, res) {
  try {
    const { studentId, fullName, courseId, facultyId, programId } = req.query;
    const { page = 1, limit = 10 } = req.query;
    const result = await StudentService.getStudents({
      studentId,
      fullName,
      courseId,
      facultyId,
      programId,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    if (!result || result.students.length === 0) {
      return res.status(200).json({ students: [], total: 0 });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getStatuses(req, res) {
  try {
    logger.info("getStatuses");
    const statuses = await StudentService.getStatuses();
    return res.status(200).json(statuses);
  } catch (error) {
    logger.error("Error getStatuses:", {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function putStatus(req, res) {
  try {
    const statusId = req.params.statusId;
    const updatedData = req.body;
    const result = await StudentService.updateStatus(statusId, updatedData);
    if (!result) {
      return res.status(404).json({ message: "Trạng thái không hợp lệ!" });
    }
    return res.status(204).send();
  } catch (error) {
    console.error("Error in putStatus:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function postStatus(req, res) {
  try {
    const result = await StudentService.createStatus(req.body);
    return res.status(201).json(result);
  } catch (error) {
    console.error("Error in studentController.postStatus:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function importStudents(req, res) {
  try {
    logger.info("importStudents");
    const format = req.query.format || "csv";
    let importResults;

    if (format === "excel") {
      const excelService = require("../services/excelService");
      importResults = await excelService.importStudentsFromExcel(
        req.file.buffer
      );
    } else {
      const csvService = require("../files/csv/csvService");

      // console.log(req.file.buffer);
      importResults = await csvService.importStudentsFromCSV(req.file.buffer);
    }

    // Calculate summary stats
    const createdCount = importResults.filter(
      (r) => r.action === "created"
    ).length;
    const updatedCount = importResults.filter(
      (r) => r.action === "updated"
    ).length;
    const failedCount = importResults.filter((r) => !r.success).length;

    res.json({
      success: true,
      results: importResults,
      summary: {
        total: importResults.length,
        created: createdCount,
        updated: updatedCount,
        failed: failedCount,
      },
    });
  } catch (error) {
    logger.error("Error importStudents", {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ error: error.message });
  }
}

async function exportStudents(req, res) {
  try {
    // const students = await StudentService.getToExportStudents(req.query);

    const format = req.query.format || "csv";
    const students = await Student.findAll({
      include: [
        { model: Faculty, as: "faculty" },
        { model: Course, as: "course" },
        { model: Program, as: "program" },
        { model: StudentStatus, as: "status" },
        { model: Nationality, as: "nationality", attributes: ["code", "name"] },
      ],
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "facultyId",
          "courseId",
          "programId",
          "permanentAddressId",
          "temporaryResidenceAddressId",
          "mailAddressId",
          "statusId",
          "nationalId",
        ],
      },
    });
    /**
     * TODO: address, idDocument
     */
    let fileData;
    let fileName;
    let contentType;
    console.log(format);
    console.log(JSON.stringify(students[0], null, 2));
    if (format === "excel") {
      const excelService = require("../services/excelService");
      fileData = await excelService.exportStudentsToExcel(students);
      fileName = "students.xlsx";
      contentType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    } else {
      const csvService = require("../files/csv/csvService");
      fileData = await csvService.exportStudentsToCSV(students);
      fileName = "students.csv";
      contentType = "text/csv";
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(fileData);
  } catch (error) {
    console.error("Error in studentController.exportStudents:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  deleteStudent,
  postStudent,
  putStudent,
  getStudents,
  getStatuses,
  putStatus,
  postStatus,
  importStudents,
  exportStudents,
};
