// middlewares/__mocks__/jwtAuth.js
const jwtAuth = jest.fn((req, res, next) => {
    console.log('Middleware jwtAuth mock appelé');
    req.auth = {
        userId: 1,
        roles: ['user', 'admin'] // Ajout des rôles nécessaires
    };
    next();
});

module.exports = jwtAuth;