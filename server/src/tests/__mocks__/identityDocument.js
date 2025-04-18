const { IdentityDocument } = require("../../service/student.service");

const mockIdentityDocumentModel = {
    findAll: jest.fn().mockResolvedValue([])
};

module.exports = {
    IdentityDocument: mockIdentityDocumentModel
}
