const { processFile } = require("../import/fileUploadService");
const StudentService = require("./studentService");
const { validationResult, body } = require("express-validator");
const logger = require('../../logger');

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
    logger.info('deleteStudent');
    const result = await StudentService.deleteStudent(req.params.studentId);
    if (result) {
      return res.status(400).json({ message: result });
    }
    return res.status(204).send();
  } catch (error) {
    logger.error('Error deleteStudent', {message: error.message, stack: error.stack});
    return res.status(500).json({ error: error.message });
  }
}

async function postStudent(req, res) {
  try {
    // Kiểm tra validation
    logger.info('postStudent');
    await Promise.all(StudentValidationRules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Error postProgram', {errors: errors.array});
      return res
        .status(400)
        .json({ error: "Dữ liệu không hợp lệ", details: errors.array() });
    }
    const result = await StudentService.createStudent(req.body);
    if (result.error) {
      logger.error('Error postProgram', {message: result.error});
      return res.status(400).json({ error: result.error });
    }
    return res.status(201).json(result.student);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      logger.error('Error postProgram', { message: error.message, stack: error.stack });
      return { error: error.response.data.error };
    }
    return { error: "Lỗi server" };
  }
}

async function putStudent(req, res) {
  // Kiểm tra validation ngay trong controller
  logger.info('putStudent');
  await Promise.all(StudentValidationRules.map((rule) => rule.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('Error putStudent', {errors: errors.array});
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const studentId = req.params.studentId;
    const updatedData = req.body;
    const result = await StudentService.updateStudent(studentId, updatedData);
    if (!result) {
      logger.warn('Warn putStudent', {studentId});
      return res.status(404).json({ message: "Sinh viên không hợp lệ!" });
    }
    return res.status(200).json(result);
  } catch (error) {
    logger.error('Error putStudent', {message: error.message, stack: error.message});
    return res.status(500).json({ error: error.message });
  }
}

async function getStudents(req, res) {
  try {
    logger.info('getStudents')
    const { studentId, query } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (studentId) {
      const student = await StudentService.getOneStudentById(studentId);
      return res
        .status(200)
        .json({ students: student ? [student] : [], total: student ? 1 : 0 });
    }

    const {
      students,
      total,
      page: fetched_page,
      limit: fetched_limit,
    } = await StudentService.getStudents({
      query,
      page,
      limit,
    });

    return res
      .status(200)
      .json({ students, total, page: fetched_page, limit: fetched_limit });
  } catch (error) {
    logger.error("Error getStudents:", {message: error.message, stack: error.stack});
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getStatuses(req, res) {
  try {
    logger.info('getStatuses');
    const statuses = await StudentService.getStatuses();
    return res.status(200).json(statuses);
  } catch (error) {
    logger.error("Error getStatuses:", {message: error.message, stack: error.stack});
    return res.status(500).json({ error: "Internal server error" });

  }
}

async function importStudents(req, res) {
  try {

    logger.info('importStudents');
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await processFile(req.file);
    return res.status(200).json(result);
  } catch (error) {
    logger.error("Error importStudents", {message: error.message, stack: error.stack});
    return res.status(500).json({ error: error.message });
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

async function exportStudents(req, res) {
  try {
    const students = await StudentService.getToExportStudents(req.query);
    return res.status(200).json(students);
  } catch (error) {
    console.error("Error in studentController.exportStudents:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { deleteStudent, postStudent, putStudent, getStudents, getStatuses, putStatus, postStatus, importStudents, exportStudents };
