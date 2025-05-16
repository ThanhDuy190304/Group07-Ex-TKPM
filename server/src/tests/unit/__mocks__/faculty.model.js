const mockFacultyModel = {
    findAll: jest.fn().mockResolvedValue([])
};

module.exports = {
    Faculty: mockFacultyModel
}