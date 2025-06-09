const BaseService = require("./base.service");
const initModels = require("../models/init-models");
const sequelize = require("../config/db");
const models = initModels(sequelize);
const { omit } = require("lodash");
const { mapSequelizeError } = require("../util/errorsMapperFromPostgres");
const { NotFoundError, ValidationError, DuplicateResourceError } = require("../util/errors");

class CourseService extends BaseService {
  constructor(models = initModels(sequelize)) {
    super(models.Course);
    this.Faculty = models.Faculty;
  }

  async create(newCourseInf) {
    if (
      !newCourseInf?.name ||
      !newCourseInf?.courseCode ||
      !newCourseInf?.credits ||
      !newCourseInf?.facultyCode ||
      !newCourseInf?.description
    ) {
      throw new ValidationError("Missing required fields", "Thiếu dữ liệu");
    }

    if (newCourseInf.credits < 2) {
      throw new ValidationError("Invalid credits", "Số tín chỉ không hợp lệ");
    }
    try {
      const newCourse = await this.model.create({
        name: newCourseInf.name.trim(),
        courseCode: newCourseInf.courseCode.trim(),
        credits: newCourseInf.credits,
        facultyCode: newCourseInf.facultyCode.trim(),
        description: newCourseInf.description.trim(),
        prerequisiteCourseCode: newCourseInf.prerequisiteCourseCode || [],
      });
      return {
        course: omit(newCourse.get({ plain: true }), ["createdAt", "updatedAt"]),
      };
    } catch (err) {
      throw mapSequelizeError(err);
    }
  }

  async update(courseId, updateData) {
    const updateFields = {};
    if (updateData?.name) {
      updateFields.name = updateData.name.trim();
    }
    if (updateData?.description) {
      updateFields.description = updateData.description.trim();
    }
    if (updateData?.facultyCode) {
      await this.#checkFacultyCode(updateData.facultyCode.trim());
      updateFields.facultyCode = updateData.facultyCode.trim();
    }
    if (updateData?.prerequisiteCourseCode) {
      await this.#checkPrerequisiteCourse({
        prerequisiteCourseCode: updateData.prerequisiteCourseCode,
        courseCode: course.courseCode,
      });
      updateFields.prerequisiteCourseCode = updateData.prerequisiteCourseCode;
    }
    if (updateData?.credits) {
      if (updateData.credits < 2) {
        throw new ValidationError("Invalid credits", "Số tín chỉ không hợp lệ");
      }
      const classes = await models.Class.findAll({
        where: { courseCode: course.courseCode },
        include: {
          model: models.Student,
          as: "studentCodeStudents",
          through: { attributes: [] },
        },
      });
      const hasStudentsRegistered = classes.some(cls => cls.studentCodeStudents.length > 0);
      if (hasStudentsRegistered) {
        throw new ValidationError(
          "Cannot update credits, students have already registered for the course",
          "Không thể cập nhật tín chỉ, có sinh viên đã đăng ký khóa học này"
        );
      }
      updateFields.credits = updateData.credits;
    }

    if (Object.keys(updateFields).length === 0) {
      throw new ValidationError("No valid fields provided for update", "Không có trường hợp lệ để cập nhật");
    }
    try {
      const updatedCourse = await this.model.update(updateFields);
      return {
        course: omit(updatedCourse.get({ plain: true }), ["createdAt", "updatedAt"]),
      };
    }
    catch (err) {
      throw mapSequelizeError(err);
    }

  }

  async #checkFacultyCode(facultyCode) {
    const faculty = await this.Faculty.findOne({ where: { faculty_code: facultyCode } });
    if (!faculty) {
      throw new NotFoundError("Faculty not found", `Khoa không tồn tại: ${facultyCode}`);
    }
  }

  async #checkPrerequisiteCourse(newCourseInf) {
    if (newCourseInf.prerequisiteCourseCode && !Array.isArray(newCourseInf.prerequisiteCourseCode)) {
      throw new ValidationError("Prerequisite course codes must be an array", "Mã môn tiên quyết phải là mảng");
    }

    if (newCourseInf.prerequisiteCourseCode?.length > 0) {
      if (
        newCourseInf.courseCode &&
        newCourseInf.prerequisiteCourseCode.includes(newCourseInf.courseCode.trim())
      ) {
        throw new ValidationError(
          "Course cannot be its own prerequisite",
          "Khóa học không thể là môn tiên quyết của chính nó"
        );
      }

      const prerequisiteCourses = await this.model.findAll({
        where: { courseCode: newCourseInf.prerequisiteCourseCode },
      });

      if (prerequisiteCourses.length !== newCourseInf.prerequisiteCourseCode.length) {
        const existingCodes = prerequisiteCourses.map(course => course.courseCode);
        const invalidCodes = newCourseInf.prerequisiteCourseCode.filter(
          code => !existingCodes.includes(code)
        );
        throw new NotFoundError(
          "Prerequisite course(s) not found",
          `Môn tiên quyết không tồn tại: ${invalidCodes.join(", ")}`
        );
      }
    }
  }
}

module.exports = CourseService;

