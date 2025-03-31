const StudentStatus = require("../model/student_status");
const BaseService = require("./base.service");

class StudentStatusService extends BaseService {
  constructor() {
    super(StudentStatus);
  }
}

module.exports = new StudentStatusService();
