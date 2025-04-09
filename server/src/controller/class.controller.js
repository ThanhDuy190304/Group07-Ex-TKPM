const classService = require("../service/class.service");

const create = async (req, res, next) => {
  try {
    const result = await classService.create(req.body);
    return res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const allocateStudent = async (req, res, next) => {
  try {
    const result = await classService.allocateStudent(
      req.body.classId,
      req.body.studentId
    );
    return res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  allocateStudent,
};
