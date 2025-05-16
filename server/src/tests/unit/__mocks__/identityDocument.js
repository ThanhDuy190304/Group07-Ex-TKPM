const mockIdentityDocumentModel = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
};

module.exports = {
    IdentityDocument: mockIdentityDocumentModel
}
