const Batch = require("../model/batch");
const BaseService = require("./base.service");

class BatchService extends BaseService {
  constructor() {
    super(Batch);
  }
}

module.exports = new BatchService();
