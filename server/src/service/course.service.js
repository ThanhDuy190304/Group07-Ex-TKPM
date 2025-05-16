const BaseService = require("./base.service");
const initModels = require("../models/init-models");
const sequelize = require("../config/db");
const models = initModels(sequelize);
const { omit } = require("lodash");
const { mapSequelizeError } = require("../util/errorsMapperFromPostgres");
const { validateUUID } = require("../util/validator");
const { NotFoundError, ValidationError, DuplicateResourceError } = require("../util/errors");

class CourseService extends BaseService {
  constructor() {
    super(models.Course);
  }

  async create(newCourseInf) {
    if (!newCourseInf?.name || !newCourseInf?.courseCode || !newCourseInf?.credits || !newCourseInf?.facultyCode || !newCourseInf?.description) {
      throw new ValidationError("Missing required fields", "Thiếu dữ liệu");
    }

    if (newCourseInf.credits < 2) {
      throw new ValidationError("Invalid credits", "Số tín chỉ không hợp lệ");
    }

    this.#checkPrerequisiteCourse(newCourseInf);
    try {
      const newCourse = await this.model.create({
        name: newCourseInf.name, courseCode:
          newCourseInf.courseCode.trim(),
        credits: newCourseInf.credits,
        facultyCode: newCourseInf.facultyCode.trim(),
        description: newCourseInf.description,
        prerequisiteCourseCode: newCourseInf.prerequisiteCourseCode
      });
      return {
        course: omit(newCourse.get({ plain: true }), ["createdAt", "updatedAt"])
      };
    }
    catch (err) {
      throw mapSequelizeError(err);
    }
  }


  async update(courseId, updateData) {
    console.log(courseId);
    const course = await this.model.findOne({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundError("Course not found", "Khóa học không tồn tại");
    }

    const updateFields = {};
    if (updateData?.name) {
      updateFields.name = updateData.name;
    }
    if (updateData?.description) {
      updateFields.description = updateData.description;
    }
    if (updateData?.facultyCode) {
      updateFields.facultyCode = updateData.facultyCode;
    }
    if (updateData?.credits) {
      const classes = await models.Class.findAll({
        where: { courseCode: course.courseCode },
        include: {
          model: models.Student,
          as: "studentCodeStudents",
          though: { attributes: [] },
        }
      });
      const hasStudentsRegistered = classes.some(cls => cls.studentCodeStudents.length > 0);
      if (hasStudentsRegistered) {
        throw new ValidationError("Cannot update credits, students have already registered for the course", "Không thể cập nhật tín chỉ, có sinh viên đã đăng ký khóa học này");
      }
      else {
        updateFields.credits = updateData.credits;
      }
    }

    const updateCourse = await course.update(updateFields);
    return {
      program: omit(updateCourse.get({ plain: true }), ["createdAt", "updatedAt"])
    }

  }

  async #checkPrerequisiteCourse(newCourseInf) {
    let validPrerequisites = [];
    if (newCourseInf.prerequisiteCourseCode && newCourseInf.prerequisiteCourseCode.length > 0) {
      const prerequisiteCourses = await models.Course.findAll({
        where: {
          courseCode: newCourseInf.prerequisiteCourseCode
        }
      });

      if (prerequisiteCourses.length !== newCourseInf.prerequisiteCourseCode.length) {
        const existingCodes = prerequisiteCourses.map(course => course.courseCode);
        const invalidCodes = newCourseInf.prerequisiteCourseCode.filter(code => !existingCodes.includes(code));

        throw new NotFoundError("Prerequisite course(s) not found", `Môn tiên quyết không tồn tại: ${invalidCodes.join(", ")}`);
      }
      validPrerequisites = prerequisiteCourses.map(course => course.courseCode);
    }
  }



}

module.exports = new CourseService();