const StudentService = require("../service/student.service");

const getAllStudents = async (req, res, next) => {
  try {
    const result = await StudentService.getAll(req.query);
    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

const create = async (req, res, next) => {
  try {
    const result = await StudentService.create(req.body);
    return res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const updateData = req.body;
    const result = await StudentService.update(studentId, updateData);
    return res.status(200).json({ data: result });
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
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    let importResults = await StudentService.importFile(req.file.buffer, fileExtension);
    return res.status(200).send({ data: importResults });
  }
  catch (error) {
    next(error);
  }
}


module.exports = {
  create,
  getAllStudents,
  update,
  remove,
  importFile,
};
