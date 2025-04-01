const Faculty = require("../model/faculty");
const BaseService = require("./base.service");

class FacultyService extends BaseService {
  constructor() {
    super(Faculty);
  }
}

module.exports = new FacultyService();
