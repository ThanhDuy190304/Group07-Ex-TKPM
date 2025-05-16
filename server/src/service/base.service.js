const { NotFoundError, ValidationError, InternalServerError, } = require("../util/errors");
const { mapSequelizeError } = require("../util/errorsMapperFromPostgres");
const pluralize = require("pluralize")
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
    try {
      const deleted = await this.model.destroy({ where: { id } });

      if (!deleted) {
        throw new NotFoundError();
      }
    } catch (err) {
      throw mapSequelizeError(err);
    }
  }

}

module.exports = BaseService;
