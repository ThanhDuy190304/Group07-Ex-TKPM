const mockProgramModel = {
    findAll: jest.fn().mockResolvedValue([])
};

module.exports = {
    Program: mockProgramModel
}