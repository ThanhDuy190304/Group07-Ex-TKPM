const Course = {
  findOne: jest.fn().mockResolvedValue(null),
  findAll: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockImplementation((data) =>
    Promise.resolve({
      id: "550e8400-e29b-41d4-a716-446655440000",
      ...data,
      isActive: true,
      createdAt: new Date(),
      update: jest.fn().mockImplementation(function (updateData) {
        Object.assign(this, updateData);
        return Promise.resolve(this);
      }),
      destroy: jest.fn().mockResolvedValue(null),
      get: function () {
        return this;
      },
    })
  ),
};

module.exports = { Course };