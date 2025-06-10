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

      await this.#checkPrerequisiteCourse(newCourseInf);

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
      } catch (err) {
        throw mapSequelizeError(err);
      }
    }

  async update(courseId, updateData) {
      if (!courseId) {
        throw new ValidationError("Course ID is required", "Yêu cầu ID khóa học");
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        throw new ValidationError("No data provided for update", "Không có dữ liệu để cập nhật");
      }

      // Prevent updating courseCode
      if (updateData.courseCode) {
        throw new ValidationError("Cannot update course code", "Không thể cập nhật mã khóa học");
      }

      // Fetch the course
      const course = await this.model.findByPk(courseId);
      if (!course) {
        throw new NotFoundError("Course not found", `Khóa học không tồn tại: ${courseId}`);
      }

      const updateFields = {};
      // Update name
      if (updateData.name) {
        if (typeof updateData.name !== "string") {
          throw new ValidationError("Name must be a string", "Tên phải là chuỗi");
        }
        updateFields.name = updateData.name.trim();
      }
      // Update description
      if (updateData.description) {
        if (typeof updateData.description !== "string") {
          throw new ValidationError("Description must be a string", "Mô tả phải là chuỗi");
        }
        updateFields.description = updateData.description.trim();
      }
      // Update facultyCode
      if (updateData.facultyCode) {
        if (typeof updateData.facultyCode !== "string") {
          throw new ValidationError("Faculty code must be a string", "Mã khoa phải là chuỗi");
        }
        await this.#checkFacultyCode(updateData.facultyCode.trim());
        updateFields.facultyCode = updateData.facultyCode.trim();
      }
      // Update prerequisiteCourseCode
      if (updateData.prerequisiteCourseCode) {
        await this.#checkPrerequisiteCourse({
          prerequisiteCourseCode: updateData.prerequisiteCourseCode,
          courseCode: course.courseCode,
        });
        updateFields.prerequisiteCourseCode = updateData.prerequisiteCourseCode;
      }
      // Update credits
      if (updateData.credits !== undefined) {
        if (!Number.isInteger(updateData.credits) || updateData.credits < 2) {
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
        const hasStudentsRegistered = classes.some(cls => cls.studentCodeStudents?.length > 0);
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
        const [affectedRows] = await this.model.update(updateFields, { where: { id: courseId } });
        if (affectedRows === 0) {
          throw new NotFoundError("Course not found or no changes applied", `Khóa học không tồn tại hoặc không có thay đổi: ${courseId}`);
        }
        const updatedCourse = await this.model.findByPk(courseId);
        if (!updatedCourse) {
          throw new NotFoundError("Updated course not found", `Khóa học đã cập nhật không tồn tại: ${courseId}`);
        }
        return {
          course: omit(updatedCourse.get({ plain: true }), ["createdAt", "updatedAt"]),
        };
      } catch (err) {
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