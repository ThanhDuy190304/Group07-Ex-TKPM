const BaseService = require("./base.service");

const initModels = require("../models/init-models");
const sequelize = require("../config/db");
const models = initModels(sequelize);
const { omit } = require("lodash");

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
      
      if(newCourseInf.credits<2){
        throw new ValidationError("Invalid credits", "Số tín chỉ không hợp lệ");
      }

      const existingCourse = await this.model.findOne({ where: { courseCode: newCourseInf.courseCode.trim() } });
      if (existingCourse) {
        throw new DuplicateResourceError("Course code already exists", "Mã môn học đã tồn tại");
      }
      
      const existingFacultyCode = await models.Faculty.findOne({where: {facultyCode: newCourseInf.facultyCode.trim()}});
      if(!existingFacultyCode){
        throw new NotFoundError("Faculty not found ", "Khoa không tồn tại");
      }

      const prerequisiteCourseCode = await this.model.findOne({where: {courseCode: newCourseInf.prerequisiteCourseCode.trim()}});
      if(!prerequisiteCourseCode){
        throw new NotFoundError("PrerequisiteCourse not found ", "Môn tiên quyết không tồn tại");
      }

      const newCourse = await this.model.create({ name: newCourseInf.name, courseCode: newCourseInf.courseCode.trim(), credits: newCourseInf.credits, facultyCode: newCourseInf.facultyCode.trim(), description: newCourseInf.description, prerequisiteCourseCode: newCourseInf.prerequisiteCourseCode });
      return {
        course: omit(newCourse.get({ plain: true }), ["createdAt", "updatedAt"])
      };
    }

    async delete(id){

      const exisitingInClass = await models.Class.findOne({where: {courseCode: id}});
      if(!exisitingInClass){
        super.delete(id);
        return;
      }
      
      this.model.isActive = false;
    }
  
  }
  
  module.exports = new CourseService();