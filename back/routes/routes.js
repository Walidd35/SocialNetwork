const express = require('express');
const router = express.Router();
const auth = require('../middlewares/jwtAuth')
const userCtrl = require('../controllers/user.controller');

// Route pour le modèle User
router.delete('/users/:id',auth,userCtrl.deleteUserById);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/users',userCtrl.getAll);
router.get('/user/:id', userCtrl.getById);

module.exports = router;
