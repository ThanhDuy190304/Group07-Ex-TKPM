const { error } = require("winston");
const StudentService = require("../service/student.service");

const getAllStudents = async (req, res, next) => {
  try {
    const result = await StudentService.getAll(req.query);
    return res.status(200).json({ data: { students: result.data, count: result.total } });
  } catch (error) {
    next(error);
  }
}

const create = async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await StudentService.create(req.body);
    return res.status(201).json({ data: result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const updateData = req.body;
    const result = await StudentService.update(studentId, updateData);
    return res.status(200).json({ data: result.data });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await StudentService.delete(req.params.studentId);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const importFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file nào được upload." });
    }
    const format = req.query.format;
    let importResults = await StudentService.importFile(req.file.buffer, format);
    return res.status(200).send(importResults);
  }
  catch (error) {
    next(error);
  }
}

// const importFile = async (req, res, next) => {
//   try {
//     logger.info("importStudents");
//     const format = req.query.format || "csv";
//     let importResults;

//     if (format === "excel") {
//       importResults = await StudentService.importCSV(req.file.buffer);
//     } else {
//       const csvService = require("../files/csv/csvService");

//       importResults = await StudentService.importExcel(req.file.buffer);
//     }

//     // Calculate summary stats
//     const createdCount = importResults.filter(
//       (r) => r.action === "created"
//     ).length;
//     const updatedCount = importResults.filter(
//       (r) => r.action === "updated"
//     ).length;
//     const failedCount = importResults.filter((r) => !r.success).length;

//     res.json({
//       success: true,
//       results: importResults,
//       summary: {
//         total: importResults.length,
//         created: createdCount,
//         updated: updatedCount,
//         failed: failedCount,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };
module.exports = {
  create,
  getAllStudents,
  update,
  remove,
  importFile,
};
