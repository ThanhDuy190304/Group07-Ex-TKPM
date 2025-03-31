const Student = require("../model/student");
const BaseService = require("./base.service");
const { validateEmail, validatePhone } = require("../util/validator");
const { NotFoundError, InternalServerError } = require("../util/errors");

class StudentService extends BaseService {
  constructor() {
    super(Student);
  }

  /**
   * TODO: COMPLETE IT
   */
  async getAllByQueryPaginanated({ page = 1, limit = 6, query }) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum <= 0 || limitNum <= 0) {
      throw new ValidationError("Page and limit must be positive numbers.");
    }

    const { rows, count } = await Student.findAndCountAll({
      offset: (pageNum - 1) * limitNum,
      limit: parseInt(limitNum),
    });

    return {
      data: rows,
      pagination: {
        count,
        totalPages: Math.ceil(count / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
    };
  }

  async update(id, data) {
    const student = await Student.findOne({ where: { studentId: id } });
    if (!student) {
      throw new NotFoundError(
        "Student not exists",
        "Sinh viên này không tồn tại"
      );
    }
    if (data.email && !validateEmail(data.email)) {
      throw new ValidationError(
        "Invalid Email. The email must end with @student.university.edu.vn",
        "Email không hợp lệ. Email phải kết thúc với @student.university.edu.vn"
      );
    }

    if (
      data.phoneNumber &&
      !validatePhone(data?.phoneNumber, data?.nationalityId)
    ) {
      throw new ValidationError(
        "Invalid phone number.",
        "Số điện thoại không hợp lệ. Vui lòng thử lại"
      );
    }

    await student.update(data);
    return {
      success: true,
      data: student,
    };
  }

  async delete(id) {
    try {
      const deleted = await Student.destroy({ where: { studentId: id } });

      if (!deleted) {
        throw new NotFoundError("Student not found", "Sinh viên không tồn tại");
      }

      return deleted;
    } catch (error) {
      throw new InternalServerError("Internal Service Error", "Lỗi hệ thống");
    }
  }

  async importCSV(file) {}

  async importExcel(file) {}
}

module.exports = new StudentService();
