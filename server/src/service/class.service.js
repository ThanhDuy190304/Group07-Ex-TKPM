const { omit } = require("lodash");
const { Op } = require("sequelize");
const sequelize = require("../config/db");
const initModels = require("../models/init-models");
const models = initModels(sequelize);
const {
  NotFoundError,
  ValidationError,
  DuplicateResourceError,
} = require("../util/errors");
const { mapSequelizeError } = require("../util/errorsMapperFromPostgres");
const { validateUUID } = require("../util/validator");
const BaseService = require("./base.service");

const { formatInTimeZone } = require("date-fns-tz");
const timeZone = "Asia/Ho_Chi_Minh";

class ClassService extends BaseService {
  constructor(models = initModels(sequelize)) {
    super(models.Class);
    this.ClassRegistration = models.ClassRegistration;
    this.Course = models.Course;
    this.ClassRegistrationPeriod = models.ClassRegistrationPeriod;
  }

  async create(classInfo) {
    const { classCode, courseCode, academicYear, semester, maxStudents } =
      classInfo;

    if (
      !classCode ||
      !courseCode ||
      !academicYear ||
      !semester ||
      !maxStudents
    ) {
      throw new ValidationError("Missing required fields", "Thiếu dữ liệu");
    }

    const course = await this.Course.findOne({
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

  async registerClassForStudent(classCode, studentCode) {
    try {
      await sequelize.transaction(async (t) => {
        const currentYear = new Date().getFullYear();
        const classInstance = await this.model.findOne({
          where: { classCode: classCode },
          include: [
            { model: this.Course, as: "courseCodeCourse", required: true },
          ],
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        if (!classInstance) {
          throw new NotFoundError("Class not found", "Lớp học không tồn tại");
        }
        const registrations = await this.ClassRegistration.findAll({
          where: { classCode: classInstance.classCode },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (registrations.length >= classInstance.maxStudents) {
          throw new ValidationError(
            "Class is full",
            "Lớp học đã đạt số lượng tối đa"
          );
        }
        const prerequisiteCourses =
          classInstance.courseCodeCourse.prerequisiteCourseCode ?? [];
        const validPrerequisites =
          prerequisiteCourses?.filter((p) => p != null) ?? [];
        if (validPrerequisites.length > 0) {
          const completedPrerequisites = await this.ClassRegistration.findAll({
            where: { studentCode },
            include: [
              {
                model: this.model, // Class
                as: "classCodeClass",
                where: {
                  academicYear: { [Op.lt]: currentYear },
                },
                attributes: ["courseCode"],
                required: true,
              },
            ],
            transaction: t,
          });

          const completedCourseCodes = completedPrerequisites.map(
            (r) => r.classCodeClass?.courseCode
          );

          const missing = prerequisiteCourses.filter(
            (code) => !completedCourseCodes.includes(code)
          );

          if (missing.length > 0) {
            throw new ValidationError(
              `Missing prerequisite course(s): ${missing.join(", ")}`,
              `Chưa học môn tiên quyết: ${missing.join(", ")}`
            );
          }
        }
        await this.ClassRegistration.create(
          {
            classCode: classCode,
            studentCode: studentCode,
          },
          { transaction: t }
        );
      });
    } catch (error) {
      throw mapSequelizeError(error);
    }
  }

  async allocateStudent(classCode, studentCode) {
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
      const validPrerequisites = coursePrerequisites.filter(
        (prerequisite) => prerequisite !== null
      );

      if (validPrerequisites.length > 0) {
        const completedCourses = allStudentRegistrations.map(
          (registration) => registration.classCodeClass?.courseCode
        );

        const hasCompletedAllPrerequisites = validPrerequisites.every(
          (prerequisite) => completedCourses.includes(prerequisite)
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

  async cancelStudentRegistration(classCode, studentCode) {
    try {
      const deleted = await models.ClassRegistration.destroy({
        where: {
          classCode: classCode,
          studentCode: studentCode,
        },
      });

      if (deleted === 0) {
        throw new NotFoundError(
          "Registration not found",
          "Đăng ký không tồn tại"
        );
      }
    } catch (error) {
      throw mapSequelizeError(error);
    }
  }

  async getDetailByClassCode(classCode) {
    try {
      const classRegistrations = await this.ClassRegistration.findAll({
        where: { classCode: classCode },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      return { classRegistrations: classRegistrations };
    } catch (error) {
      throw mapSequelizeError(error);
    }
  }

  async getClassRegistrationPeriods() {
    try {
      const periods = await this.ClassRegistrationPeriod.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      const classRegistrationPeriods = periods.map((p) => {
        return {
          ...p.toJSON(),
          startDateTime: formatInTimeZone(
            new Date(p.startDateTime),
            timeZone,
            "yyyy-MM-dd HH:mm:ssXXX"
          ),
          endDateTime: formatInTimeZone(
            new Date(p.endDateTime),
            timeZone,
            "yyyy-MM-dd HH:mm:ssXXX"
          ),
        };
      });

      return { classRegistrationPeriods: classRegistrationPeriods };
    } catch (error) {
      throw mapSequelizeError(error);
    }
  }

  async createClassRegistrationPeriod(periodInfo) {
    try {
      console.log("Creating class registration period with info:", periodInfo);
      const { startDateTime, endDateTime, semester, academicYear } = periodInfo;
      if (!startDateTime || !endDateTime || !semester || !academicYear) {
        throw new ValidationError("Missing required fields", "Thiếu dữ liệu");
      }
      if (new Date(startDateTime) >= new Date(endDateTime)) {
        throw new ValidationError(
          "Start date must be before end date",
          "Ngày bắt đầu phải trước ngày kết thúc"
        );
      }
      await this.ClassRegistrationPeriod.create({
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        semester,
        academicYear,
      });
    } catch (error) {
      throw mapSequelizeError(error);
    }
  }

  async updateClassRegistrationPeriod(id, periodInfo) {
    try {
      const { startDateTime, endDateTime, isActive } = periodInfo;
      if (
        startDateTime &&
        endDateTime &&
        new Date(startDateTime) >= new Date(endDateTime)
      ) {
        throw new ValidationError(
          "Start time must be before end time",
          "Thời gian bắt đầu phải trước thời gian kết thúc"
        );
      }

      const updateData = {
        startDateTime: startDateTime ? new Date(startDateTime) : undefined,
        endDateTime: endDateTime ? new Date(endDateTime) : undefined,
        isActive,
      };

      // Xóa các field undefined khỏi object
      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key]
      );

      await this.ClassRegistrationPeriod.update(updateData, {
        where: { id },
      });
    } catch (error) {
      throw mapSequelizeError(error);
    }
  }
}

module.exports = ClassService;
