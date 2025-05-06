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
      req.params.classId,
      req.params.studentId
    );
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const cancelStudentRegistration = async (req, res, next) => {
  try {
    const result = await classService.cancelStudentRegistration(
      req.params.classId,
      req.params.studentId
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  allocateStudent,
  cancelStudentRegistration,
};
