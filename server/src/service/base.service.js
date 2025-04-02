const { NotFoundError, ValidationError, InternalServerError, } = require("../util/errors");
const { validateUUID } = require("../util/validator");

class BaseService {
  constructor(model) {
    this.model = model;
  }

  async getAll() {
    try {
      console.log(this);
      const rows = await this.model.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
      return {
        data: rows,
        total: rows.length,
      };
    } catch (error) {
      console.log("Error in base.service.getAll: ", error.message);
      throw new InternalServerError(error.message);
    }
  }

  // async getAllPaginated({ page = 1, limit = 6, order = [], filters = {} }) {
  //   try {
  //     // Convert pagination values to numbers
  //     const pageNum = parseInt(page, 10);
  //     const limitNum = parseInt(limit, 10);

  //     if (isNaN(pageNum) || isNaN(limitNum) || pageNum <= 0 || limitNum <= 0) {
  //       throw new ValidationError("Page and limit must be positive numbers.");
  //     }

  //     const where = {};
  //     for (const key in filters) {
  //       if (Array.isArray(filters[key])) {
  //         where[key] = { $in: filters[key] }; // Handle array filters (e.g., ?status=active,inactive)
  //       } else {
  //         where[key] = filters[key];
  //       }
  //     }

  //     const sortQuery = {};
  //     for (const [field, direction] of order) {
  //       sortQuery[field] = direction.toLowerCase() === "asc" ? 1 : -1;
  //     }

  //     const { rows, count } = await this.model.findAndCountAll({
  //       offset: (pageNum - 1) * limitNum,
  //       limit: parseInt(limitNum),
  //     });

  //     return {
  //       data: rows,
  //       pagination: {
  //         count,
  //         totalPages: Math.ceil(count / limitNum),
  //         currentPage: pageNum,
  //         limit: limitNum,
  //       },
  //     };
  //   } catch (error) {
  //     throw new InternalServerError(error.message);
  //   }
  // }

  async getById(id) {
    try {
      const record = await this.model.findById(id).lean();
      if (!record) throw new NotFoundError("Resource not found");
      return record;
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }

  // // 🔹 Create a new document
  // async create(data) {
  //   try {
  //     // const record = new this.model(data);
  //     const record = await this.model.create(data);
  //     console.log(record);
  //     return record;
  //   } catch (error) {
  //     throw new ValidationError(error.message, "Tạo mới không thành công");
  //   }
  // }

  // async update(id, data) {
  //   try {
  //     const record = await this.model.findOne({ where: { id } });

  //     if (!record) throw new NotFoundError("Resource not found");

  //     await record.update(data);
  //     return record;
  //   } catch (error) {
  //     throw new ValidationError(error.message);
  //   }
  // }

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
