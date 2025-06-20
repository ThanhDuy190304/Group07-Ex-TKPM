const mockClassModel = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  upsert: jest.fn(),
  findAndCountAll: jest.fn(),
};

const mockClassRegistrationModel = {
  destroy: jest.fn(),
};

module.exports = {
  Class: mockClassModel,
  ClassRegistration: mockClassRegistrationModel,
};
