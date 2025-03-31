const { removeTicks } = require("sequelize/lib/utils");
const StudentStatusService = require("../service/status.service");

const getAll = async (req, res, next) => {
  try {
    const response = await StudentStatusService.getAll();
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const response = await StudentStatusService.update(req.params.id, req.body);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const status = await StudentStatusService.create(req.body);
    res.status(201).json(status);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  create,
  // getById,
  update,
};
