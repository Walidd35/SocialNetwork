// __mocks__/models.js

module.exports = {
    User: {
        findOne: jest.fn(),
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        destroy: jest.fn(),
        belongsToMany: jest.fn()
    },
    Roles: {
        findOne: jest.fn(),
        findAll: jest.fn(),
        belongsToMany: jest.fn()
    }
};
test('test pour tester', () => {
    expect(true).toBe(true);
  });