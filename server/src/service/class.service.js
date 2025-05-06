const { omit } = require("lodash");

const sequelize = require("../config/db");
const initModels = require("../models/init-models");
const models = initModels(sequelize);
const {
  NotFoundError,
  ValidationError,
  DuplicateResourceError,
} = require("../util/errors");

const { validateUUID } = require("../util/validator");
const BaseService = require("./base.service");

class ClassService extends BaseService {
  constructor() {
    super(models.Class);
  }

  async create(classInfo) {
    const { classCode, courseCode, academicYear, semester, maxStudents } = classInfo;
  
    if (!classCode || !courseCode || !academicYear || !semester || !maxStudents) {
      throw new ValidationError("Missing required fields", "Thiếu dữ liệu");
    }
  
    const course = await models.Course.findOne({
      where: { courseCode },
    });

    if (!course) {
      throw new NotFoundError("Course not found", "Khóa học không tồn tại");
    }
  
    const existingClass = await this.model.findOne({
      where: { classCode },
    });

    if (existingClass) {
      throw new DuplicateResourceError(
        "Class code already exists",
        "Mã lớp đã tồn tại"
      );
    }
  
    const newClass = await this.model.create({
      ...classInfo,
      courseCode,
    });
  
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

    const currentRegistrations = await models.ClassRegistration.count({
      where: { classCode: classInstance.classCode },
    });
    
    if (currentRegistrations >= classInstance.maxStudents) {
      throw new ValidationError(
        "Class is full",
        "Lớp học đã đạt số lượng tối đa"
      );
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

    if (coursePrerequisites && coursePrerequisites.length > 0) {
      // Filter out null items from prerequisites
      const validPrerequisites = coursePrerequisites.filter((prerequisite) => prerequisite !== null);
  
      if (validPrerequisites.
        length > 0) {
        const completedCourses = allStudentRegistrations.map(
          (registration) => registration.classCodeClass?.courseCode
        );
  
        const hasCompletedAllPrerequisites = validPrerequisites.every((prerequisite) =>
          completedCourses.includes(prerequisite)
        );
  
        if (!hasCompletedAllPrerequisites) {
          throw new ValidationError(
            "Student does not meet course prerequisites",
            "Sinh viên không đáp ứng yêu cầu tiên quyết của khóa học"
          );
        }
      }
    }

    const result = await models.ClassRegistration.create({
      classCode: classInstance.classCode,
      studentCode: student.studentCode,
    });

    return { data: result };
  }

  async cancelStudentRegistration(classId, studentId) {
    if (!validateUUID(classId) || !validateUUID(studentId)) {
      throw new ValidationError();
    }
  
    const classInstance = await this.model.findOne({
      where: { id: classId },
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
  
    const registration = await models.ClassRegistration.findOne({
      where: {
        classCode: classInstance.classCode,
        studentCode: student.studentCode,
      },
    });
  
    if (!registration) {
      throw new NotFoundError(
        "Registration not found",
        "Đăng ký không tồn tại"
      );
    }
  
    await registration.destroy();
  
    return { message: "Registration canceled successfully", message_vi: "Hủy đăng ký thành công" };
  }
}

module.exports = new ClassService();
