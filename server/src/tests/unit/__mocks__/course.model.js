const { find } = require("lodash");

const mockCourseModel = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  upsert: jest.fn(),
  findAndCountAll: jest.fn(),
};

module.exports = {
  Course: mockCourseModel,
};
