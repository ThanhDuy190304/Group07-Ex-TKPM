const mockFacultyModel = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
    findAndCountAll: jest.fn(),
};

module.exports = {
    Faculty: mockFacultyModel
}
