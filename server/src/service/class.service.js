const BaseService = require("./base.service");

const initModels = require("../models/init-models");
const sequelize = require("../config/db");
const models = initModels(sequelize);
const { omit, includes } = require("lodash");

const { validateUUID } = require("../util/validator");
const {
  NotFoundError,
  ValidationError,
  DuplicateResourceError,
} = require("../util/errors");

class ClassService extends BaseService {
  constructor() {
    super(models.Class);
  }

  async create(newClassInf) {
    if (!newClassInf?.classCode || !newClassInf?.courseCode) {
      throw new ValidationError("Missing required fields", "Thiếu dữ liệu");
    }

    const existingClass = await this.model.findOne({
      where: { classCode: newClassInf.classCode.trim() },
    });

    if (existingClass) {
      throw new DuplicateResourceError(
        "Class code already exists",
        "Mã lớp đã tồn tại"
      );
    }
    const newClass = await this.model.create({ ...newClassInf });
    return {
      class: omit(newClass.get({ plain: true }), ["createdAt", "updatedAt"]),
    };
  }

  async allocateStudent(classId, studentId) {
    if (!validateUUID(classId) || !validateUUID(studentId)) {
      throw new ValidationError();
    }

    const classInstance = await this.model.findOne({
      where: { id: classId },
      include: [
        {
          model: models.Course,
          as: "courseCodeCourse",
        },
      ],
    });
    if (!classInstance) {
      throw new NotFoundError("Class not found", "Lớp học không tồn tại");
    }

    const student = await models.Student.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundError("Student not found", "Sinh viên không tồn tại");
    }

    // Check if the student is already allocated to the class

    const allStudentRegistrations = await models.ClassRegistration.findAll({
      where: { studentCode: student.studentCode },
      include: [
        {
          model: models.Class,
          as: "classCodeClass",
        },
      ],
    });

    const exists = await allStudentRegistrations.some((registration) => {
      return registration.classCode === classInstance.classCode;
    });

    if (exists) {
      throw new DuplicateResourceError(
        "Student already allocated to this class",
        "Sinh viên đã được phân bổ vào lớp này"
      );
    }

    // Check if the registration violates the course prerequisites
    const coursePrerequisites =
      classInstance.courseCodeCourse.prerequisiteCourseCode;

    const isCompletedPrerequisites = await allStudentRegistrations.some(
      (registration) => {
        console.log(registration.classCodeClass?.courseCode);
        registration.classCodeClass?.courseCode === coursePrerequisites;
      }
    );

    if (coursePrerequisites !== null && !isCompletedPrerequisites) {
      throw new ValidationError(
        "Student does not meet course prerequisites",
        "Sinh viên không đáp ứng yêu cầu tiên quyết của khóa học"
      );
    }

    const result = await models.ClassRegistration.create({
      classCode: classInstance.classCode,
      studentCode: student.studentCode,
    });

    return { data: result };
  }
}

module.exports = new ClassService();
