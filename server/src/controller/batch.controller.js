const BatchService = require("../service/batch.service");

const getAll = async (req, res, next) => {
  try {
    const response = await BatchService.getAll();
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
};
