const FacultyService = require("../service/faculty.service");

const getAll = async (req, res, next) => {
  try {
    const response = await FacultyService.getAll();
    return res.status(200).json({ data: response.data });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const result = await FacultyService.create(req.body);
    return res.status(201).json({ data: result.data });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const facultyId = req.params.facultyId;
    const updateData = req.body;
    const result = await FacultyService.update(facultyId, updateData);
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
