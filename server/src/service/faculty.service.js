const BaseService = require("./base.service");

const initModels = require("../models/init-models");
const sequelize = require("../config/db");
const models = initModels(sequelize);
const { omit } = require("lodash");

const { validateUUID } = require("../util/validator");
const { NotFoundError, ValidationError, DuplicateResourceError } = require("../util/errors");

class FacultyService extends BaseService {
  constructor() {
    super(models.Faculty);
  }

  async update(facultyId, updateData) {
    if (!validateUUID(facultyId)) {
      throw new ValidationError();
    }
    const faculty = await this.model.findOne({ where: { id: facultyId } });
    if (!faculty) {
      throw new NotFoundError("Faculty not found ", "Khoa không tồn tại");
    }
    const updateFields = {};
    if (updateData?.facultyCode && updateData?.facultyCode.trim() !== faculty.facultyCode) {
      const existingFaculty = await this.model.findOne({ where: { facultyCode: updateData.facultyCode.trim() } });
      if (existingFaculty) {
        throw new DuplicateResourceError("Faculty code already exists", "Mã khoa đã tồn tại");
      }
      updateFields.facultyCode = updateData.facultyCode.trim();
    }
    if (updateData?.name) updateFields.name = updateData.name;
    const updatedFaculty = await faculty.update(updateFields);
    return {
      data: omit(updatedFaculty.get({ plain: true }), ["createdAt", "updatedAt"])
    };

  }

  async create(data) {
    if (!data?.name || !data?.facultyCode) {
      throw new ValidationError("Missing required fields", "Thiếu dữ liệu");
    }
    const existingFaculty = await this.model.findOne({ where: { facultyCode: data.facultyCode.trim() } });
    if (existingFaculty) {
      throw new DuplicateResourceError("Faculty code already exists", "Mã khoa đã tồn tại");
    }
    const newFaculty = await this.model.create({ name: data.name, facultyCode: data.facultyCode.trim() });
    return {
      data: omit(newFaculty.get({ plain: true }), ["createdAt", "updatedAt"])
    };
  }

}

module.exports = new FacultyService();
