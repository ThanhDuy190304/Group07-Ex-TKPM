const { processFile } = require("../import/fileUploadService");
const StudentService = require("./studentService");
const { validationResult, body } = require("express-validator");
const logger = require("../../logger");
const { error } = require("winston");
const {
  ValidationError,
  DuplicateResourceError,
  BaseError,
} = require("../../util/errors");

async function deleteStudent(req, res) {
  try {
    const result = await StudentService.deleteStudent(req.params.studentId);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

async function postStudent(req, res) {
  try {
    // const errors = await StudentService.checkStudentData(req);
    // if (!errors.success) {
    //   return res.status(400).json({ error: errors.message, details: errors.data });
    // }

    const result = await StudentService.createStudent(req.body);
    // if (!result.success) {
    //   return res.status(400).json({ error: result.error });
    // }
    return res.status(201).json(result.student);
  } catch (error) {
    // if (error.response && error.response.status === 400) {
    //   return { error: error.response.data.error };
    // }

    if (error instanceof BaseError) {
      console.log(error);
      return res
        .status(error.statusCode)
        .json({ error: error.message, error_vn: error.message_vi });
    }
    return res.status(500).json({ error: error });
  }
}

async function putStudent(req, res) {
  try {
    const studentId = req.params.studentId;
    const updatedData = req.body;
    const result = await StudentService.updateStudent(studentId, updatedData);
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    return res.status(200).json({ data: result.error });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

async function getPaginatedStudents(req, res) {
  try {
    const result = await StudentService.getPaginatedStudents(req.query);
    if (result.success) {
      return res
        .status(200)
        .json({ data: { students: result.students, total: result.total } });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

async function getStatuses(req, res) {
  try {
    const result = await StudentService.getStatuses();
    if (result.success) {
      return res.status(200).json({ data: result.statuses });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

async function importStudents(req, res) {
  try {
    logger.info("importStudents");
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const result = await processFile(req.file);
    console.log(result);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

async function putStatus(req, res) {
  try {
    const statusId = req.params.statusId;
    const updatedData = req.body;
    const result = await StudentService.updateStatus(statusId, updatedData);
    if (!result.data) {
      return res.status(404).json({ message: result.message });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

async function postStatus(req, res) {
  try {
    const result = await StudentService.createStatus(req.body);
    return res.status(201).json(result.status);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

async function getAllStudents(req, res) {
  try {
    const students = await StudentService.getAllStudents(req.query);
    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

module.exports = {
  deleteStudent,
  postStudent,
  putStudent,
  getPaginatedStudents,
  getStatuses,
  putStatus,
  postStatus,
  importStudents,
  getAllStudents,
};
