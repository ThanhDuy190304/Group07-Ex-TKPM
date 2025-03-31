const StudentService = require("../service/student.service");

const getAllPaginated = async (req, res, next) => {
  try {
    const { page, limit, searchQuery } = req.query;

    const result = await StudentService.getAllByQueryPaginanated(
      page,
      limit,
      searchQuery
    );

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

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
    const updatedData = req.body;
    const result = await StudentService.update(studentId, updatedData);

    return res.status(200).json({ data: result.error });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await StudentService.delete(req.params.studentId);

    return res.status(204).json(result);
  } catch (error) {
    next(error);
  }
};

const importFile = async (req, res, next) => {
  try {
    logger.info("importStudents");
    const format = req.query.format || "csv";
    let importResults;

    if (format === "excel") {
      importResults = await StudentService.importCSV(req.file.buffer);
    } else {
      const csvService = require("../files/csv/csvService");

      importResults = await StudentService.importExcel(req.file.buffer);
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
    next(error);
  }
};
module.exports = {
  create,
  getAllPaginated,
  update,
  remove,
  importFile,
};
