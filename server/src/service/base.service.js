const { NotFoundError, ValidationError, InternalServerError, } = require("../util/errors");
const pluralize = require("pluralize")
const { validateUUID } = require("../util/validator");
const { camelCase } = require("lodash");

class BaseService {
  constructor(model) {
    this.model = model;
  }

  async getAll() {
    const rows = await this.model.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    // Generate collection name by pluralizing and converting model name to camel case
    const collectionName = camelCase(pluralize(this.model.name));
    return {
      [collectionName]: rows,
      total: rows.length,
    };
  }

  async delete(id) {
    if (!validateUUID(id)) {
      throw new ValidationError();
    }
    const deleted = await this.model.destroy({ where: { id: id } });
    if (!deleted) {
      throw new NotFoundError();
    }
  }
}
module.exports = BaseService;
