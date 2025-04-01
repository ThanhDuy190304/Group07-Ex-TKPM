
const Program = require("../model/program");
const BaseService = require("./base.service");

class ProgramService extends BaseService {
  constructor() {
    super(Program);
  }
}

module.exports = new ProgramService();
