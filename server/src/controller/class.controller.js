const ClassService = require("../service/class.service");

const classService = new ClassService();

const getAll = async (req, res, next) => {
  try {
    const result = await classService.getAll();
    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

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
    await classService.registerClassForStudent(
      req.params.classCode,
      req.params.studentCode
    );
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const cancelStudentRegistration = async (req, res, next) => {
  try {
    await classService.cancelStudentRegistration(
      req.params.classCode,
      req.params.studentcode
    );
    return res.status(200).send();
  } catch (error) {
    next(error);
  }
};

const getDetailByClassCode = async (req, res, next) => {
  try {
    const result = await classService.getDetailByClassCode(req.params.classCode);
    return res.status(200).json({ data: result })
  } catch (error) {
    next(error);
  }
}

const getClassRegistrationPeriods = async (req, res, next) => {
  try {
    const result = await classService.getClassRegistrationPeriods();
    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

const createClassRegistrationPeriod = async (req, res, next) => {
  try {
    console.log("Creating class registration period with info:", req.body);
    await classService.createClassRegistrationPeriod(req.body);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const updateClassRegistrationPeriod = async (req, res, next) => {
  try {
    await classService.updateClassRegistrationPeriod(req.params.id, req.body);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  allocateStudent,
  cancelStudentRegistration,
  getDetailByClassCode,
  getClassRegistrationPeriods,
  createClassRegistrationPeriod,
  updateClassRegistrationPeriod
};
