
const jwtAuth = jest.fn((req, res, next) => {
    console.log('Middleware jwtAuth mock appelé');
    req.auth = {
        userId: 1,
        roles: ['user', 'admin'] 
    };
    next();
});

module.exports = jwtAuth;