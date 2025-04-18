const mockStudentModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
    findAndCountAll: jest.fn(),
};

module.exports = {
    Student: mockStudentModel,
};
