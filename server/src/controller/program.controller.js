const ProgramService = require("../service/program.service");

const getAll = async (req, res, next) => {
  try {
    const response = await ProgramService.getAll();
    return res.status(200).json({ data: response.data });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const result = await ProgramService.create(req.body);
    return res.status(201).json({ data: result.data });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const programId = req.params.programId;
    const updateData = req.body;
    const result = await ProgramService.update(programId, updateData);
    return res.status(200).json({ data: result.data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  create,
  update,
};
