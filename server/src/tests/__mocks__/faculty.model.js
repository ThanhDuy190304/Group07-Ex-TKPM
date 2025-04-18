const { Faculty } = require("../../service/student.service");

const mockFacultyModel = {
    findAll: jest.fn().mockResolvedValue([])
};

module.exports = {
    Faculty: mockFacultyModel
}