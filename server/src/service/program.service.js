const BaseService = require("./base.service");

const initModels = require("../models/init-models");
const sequelize = require("../config/db");
const models = initModels(sequelize);
const { omit } = require("lodash");

const { validateUUID } = require("../util/validator");
const { NotFoundError, ValidationError, DuplicateResourceError } = require("../util/errors");


class ProgramService extends BaseService {
  constructor() {
    super(models.Program);
  }

  async update(programId, updateData) {
    if (!validateUUID(programId)) {
      throw new ValidationError();
    }
    const program = await this.model.findOne({ where: { id: programId } });
    if (!program) {
      throw new NotFoundError("Program not found ", "Chương trình không tồn tại");
    }
    const updateFields = {};
    if (updateData?.programCode && updateData?.programCode.trim() !== program.programCode) {
      const existingProgram = await this.model.findOne({ where: { programCode: updateData.programCode.trim() } });
      if (existingProgram) {
        throw new DuplicateResourceError("Program code already exists", "Mã chương trình đã tồn tại");
      }
      updateFields.programCode = updateData.programCode.trim();
    }
    if (updateData?.name) updateFields.name = updateData.name;
    const updatedProgram = await program.update(updateFields);

    return {
      program: omit(updatedProgram.get({ plain: true }), ["createdAt", "updatedAt"])
    };

  }

  async create(newProgramInf) {
    if (!newProgramInf?.name || !newProgramInf?.programCode) {
      throw new ValidationError("Missing required fields", "Thiếu dữ liệu");
    }
    const existingProgram = await this.model.findOne({ where: { programCode: newProgramInf.programCode.trim() } });
    if (existingProgram) {
      throw new DuplicateResourceError("Program code already exists", "Mã chương trình đã tồn tại");
    }
    const newProgram = await this.model.create({ name: newProgramInf.name, programCode: newProgramInf.programCode.trim() });
    return {
      program: omit(newProgram.get({ plain: true }), ["createdAt", "updatedAt"])
    };
  }

}

module.exports = new ProgramService();
