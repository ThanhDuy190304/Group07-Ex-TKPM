const { processFile } = require("../files/fileUploadService");
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
    const result = await StudentService.createStudent(req.body);
    return res.status(201).json({ data: result.student });
  } catch (error) {
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

    return res.status(200).json({ data: result.error });
  } catch (error) {
    if (error instanceof BaseError) {
      console.log(error);
      return res
        .status(error.statusCode)
        .json({ error: error.message, error_vn: error.message_vi });
    }
    return res.status(500).json({ error: error });
  }
}

async function getPaginatedStudents(req, res) {
  try {
    const { page, limit, searchQuery } = req.query;
    const result = await StudentService.getPaginatedStudents(page, limit, searchQuery);
    if (result.success) {
      return res
        .status(200)
        .json({ data: { students: result.students, total: result.total } });
    }
  } catch (error) {
    console.error("Error in studentController.getPaginatedStudents: ", error);
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
          "nationalityId",
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
  exportStudents,
  getAllStudents,
};
